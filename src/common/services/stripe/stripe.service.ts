import * as Stripe from 'stripe';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config.service';
import { PaymentData } from '../../../fund/dto/payment-data-input.dto';
import { User } from '../../../user/user.entity';
import { getManager, Repository, Not } from 'typeorm';
import { Fund } from '../../../fund/fund.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity, TransactionType } from '../../transaction/transaction.entity';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class StripeService {
  appKey;
  appSecret;
  clientId;
  private stripe: Stripe;

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {
    this.appKey = config.get('STRIPE_API_KEY');
    this.appSecret = config.get('STRIPE_SECRET');
    this.clientId = config.get('STRIPE_CLIENT_ID');
    this.stripe = new Stripe(this.appSecret);
  }

  getAuthLink(url) {
    return `https://connect.stripe.com/oauth/authorize?\
response_type=code&\
scope=read_write&\
redirect_uri=${url}&\
response_type=code&\
client_id=${this.clientId}`;
  }

  async connect(code: string) {
    return this.stripe.oauth.token({
      grant_type: 'authorization_code',
      code,
    });
  }

  async testConnect(refresh_token: string) {
    return this.stripe.oauth.token({
      grant_type: 'refresh_token',
      refresh_token,
    });
  }

  async deauthorizeConnect(user: User) {
    // Wrong types for deauthorize in @types/stripe
    let oauth: any;
    oauth = this.stripe.oauth;

    return oauth.deauthorize({
      client_id: this.clientId,
      stripe_user_id: user.stripeUserId,
    });
  }

  async createUser(user: User) {
    const customer = await this.stripe.customers.create({
      email: user.email,
      name: user.username,
      phone: user.mobile,
    });
    user.stripeId = customer.id;
    return await getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(User, user);
    });
  }

  async sourceList(user: User) {
    let cards;
    try {
      cards = await this.stripe.customers.listSources(user.stripeId, {object: 'card'});
    } catch (e) {
      if (e.code === 'resource_missing' && e.param === 'customer') {
        await this.createUser(user);
        return [];
      }
      throw e;
    }
    return cards.data;
  }

  async deleteSource(user: User, id: string) {
    let cards;
    try {
      cards = await this.stripe.customers.deleteSource(user.stripeId, id);
    } catch (e) {
      throw e;
    }
    return cards.data;
  }

  async createSource(payment, user) {
    let card;
    card =  await this.stripe.tokens.create({
      card: {
        exp_month: +payment.exp_month,
        exp_year: +payment.exp_year,
        number: payment.card,
        cvc: payment.cvc,
        name: payment.cardName || user.stripeId,
        object: 'card',
      },
    });
    card = await this.stripe.customers.createSource(
      user.stripeId,
      {
        source: card.id,
      },
    );
    return card;
  }

  async charge(payment: PaymentData, fund: Fund, user: User) {
    let card;
    if (!payment.cardId) {
      card = await this.createSource(payment, user);
    }

    let connect = false;
    let result;
    try {
      connect = !!(await this.testConnect(fund.owner.stripeAuthRefreshToken));
    // tslint:disable-next-line:no-empty
    } catch (e) {}
    try {
      if (!connect) {
        result = await this.stripe.charges.create({
          amount: Math.floor((payment.amount + (payment.amount * 0.05)) * 100),
          source: payment.cardId || card.id,
          customer: user.stripeId,
          currency: 'GBP',
          transfer_group: `FUND-${fund.id}`,
        });
      } else {
        result = await this.stripe.charges.create({
          amount: Math.floor((payment.amount + (payment.amount * 0.05)) * 100),
          source: payment.cardId || card.id,
          customer: user.stripeId,
          transfer_data: {
            destination: fund.owner.stripeUserId,
            amount: Math.floor(payment.amount * 100),
          },
          currency: 'GBP',
          transfer_group: `FUND-${fund.id}`,
        });

      }
    } catch (e) {
      const transFail = this.transactionRepository.create({
        user: {id: user.id},
        amount: payment.amount * 100,
        fee: Math.floor(payment.amount * 0.05 * 100),
        fund: {id: fund.id},
        stripeId: e.charge,
        type: TransactionType.FAIL,
        ananim: payment.ananim,
        noWithdrawal: true,
        data: e,
        currency: 'GBP',
      });
      await this.transactionRepository.save(transFail);
      throw new BadRequestException((e.code.indexOf('charge_') === 0) ? e.message : 'Payment failed');
    }

    const trans = this.transactionRepository.create({
      user: {id: user.id},
      amount: payment.amount * 100,
      fee: Math.floor(payment.amount * 0.05 * 100),
      fund: {id: fund.id},
      stripeId: result.id,
      type: TransactionType.PAYMENT,
      ananim: payment.ananim,
      noWithdrawal: !connect,
      data: result,
      currency: 'GBP',
    });
    await this.transactionRepository.save(trans);

    if (connect) {
      const transOut = this.transactionRepository.create({
        user: {id: fund.owner.id},
        amount: payment.amount * 100,
        fee: Math.floor(payment.amount * 0.05 * 100),
        fund: {id: fund.id},
        stripeId: result.id,
        type: TransactionType.WITHDRAW,
        currency: 'GBP',
      });
      await this.transactionRepository.save(transOut);
    }

    if (!payment.save && !payment.cardId) {
      await this.stripe.customers.deleteSource(
        user.stripeId,
        card.id,
      );
    }
  }

  async getMyTransaction(user: User, sort) {
    return this.transactionRepository.find({ where: {
      type: Not(TransactionType.FAIL),
      user: {id: user.id},
    }, relations: ['fund', 'product'],
    order: sort,
  });
  }

  async payout(payment: PaymentData, fund_id: number, user: User, fund: Fund) {
    const max = await this.canPayout(fund_id);
    if (max < payment.amount) {
      throw new BadRequestException('You can\'t withdraw so much');
    }

    let card;
    if (!payment.cardId) {
      card = this.createSource(payment, user);
    }

    const result = await this.stripe.payouts.create({
      amount: Math.floor(payment.amount * 100),
      currency: 'GBP',
      description: `FUND-${fund_id} payout`,
      destination: payment.cardId || card.id,
      source_type: 'card',
    });

    const trans = this.transactionRepository.create({
      user: {id: user.id},
      amount: payment.amount * 100,
      fee: 0,
      fund: {id: fund_id},
      stripeId: result.id,
      type: TransactionType.WITHDRAW,
      ananim: payment.ananim,
      currency: 'GBP',
    });

    if (!payment.save && !payment.cardId) {
      await this.stripe.customers.deleteSource(
        user.stripeId,
        card.id,
      );
    }

    await this.transactionRepository.save(trans);
  }

  async chargeListByFunds(ids: number[]): Promise<any[]> {
    if (!ids || !ids.length) {
      return [];
    }
    try {
      return this.transactionRepository.createQueryBuilder('transaction')
        .select('transaction.fund_id, SUM(transaction.amount) as value')
        .where('transaction.fund_id IN (:...fundIds)', {fundIds: ids})
        .andWhere('transaction.type = :type', {type: TransactionType.PAYMENT})
        .orderBy('SUM(transaction.amount)', 'DESC')
        .groupBy('transaction.fund_id')
        .execute();
    } catch (e) {
      console.log(e)
      return [];
    }
  }

  async canPayout(id: number): Promise<any> {
    try {
      const data: any[] = await this.transactionRepository.createQueryBuilder('transaction')
        .select('transaction.type, SUM(transaction.amount) as value')
        .where('transaction.fund_id IN (:fundId)', {fundId: id})
        .orderBy('SUM(transaction.amount)', 'DESC')
        .groupBy('transaction.type')
        .execute();

      return data.reduce((a, d) => {
        switch (d.type) {
          case TransactionType.PAYMENT:
            return a + d.value;
          case TransactionType.WITHDRAW:
            return a - d.value;
          default:
            return a;
        }
      }, 0);

    } catch (e) {
      console.log(e)
      return 0;
    }
  }

  async chargeListByUser(id: number): Promise<any[]> {
    // if (!user.stripeId) {
    //   return [];
    // }
    try {
      return this.transactionRepository.createQueryBuilder('transaction')
        .select('transaction.fund_id, SUM(transaction.amount) as value')
        .where('transaction.user_id = :userId', {userId: id})
        .andWhere('transaction.type = :type', {type: TransactionType.PAYMENT})
        .orderBy('SUM(transaction.amount)', 'DESC')
        .groupBy('transaction.fund_id')
        .execute();
    } catch (e) {
      console.log(e)
      return [];
    }
  }

  async getTopThreeFunds(id: number): Promise<any[]> {
    try {
      return this.transactionRepository.createQueryBuilder('transaction')
        .select('transaction.fund_id, SUM(transaction.amount) as total')
        .where('transaction.user_id = :userId', {userId: id})
        .andWhere('transaction.type = :type', {type: TransactionType.PAYMENT})
        .orderBy('SUM(transaction.amount)', 'DESC')
        .groupBy('transaction.fund_id')
        .limit(3)
        .execute();
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
