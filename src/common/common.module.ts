import { Module, HttpModule } from '@nestjs/common';
import { EmailService } from './services/email/email.service';
import { MailerModule,  HandlebarsAdapter } from '@nest-modules/mailer';
import { ScheduleModule } from 'nest-schedule';

import { mgauth } from './config';
import { join } from 'path';
import { ConfigService } from './services/config.service';
import { AuthService } from './services/auth/auth.service';
import { PostcodesApiService } from './services/postcodes-api/postcodes.service';
import { FileService } from './services/file/file.service';
import * as mailgunTransport from 'nodemailer-mailgun-transport';
import { YahooService } from './services/yahoo/yahoo.service';
import { GoogleService } from './services/google/google.service';
import { MSMailService } from './services/msmail/msmail.service';
import { StripeService } from './services/stripe/stripe.service';
import { CashEntity } from './cash/cash.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashService } from './services/cash.service';
import {DarkskysService} from './services/darkskys-api/darkskys.service';
import { Community } from './community/community.entity';
import { CommunityResolver } from './community/community.resolver';
import { CommunityService } from './community/community.service';
import { District } from './community/district.entity';
import { County } from './community/county.entity';
import { TransactionEntity } from './transaction/transaction.entity';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: mailgunTransport(mgauth),
      defaults: {
        from: '"SLP" <modules@nestjs.com>',
      },
      template: {
        dir: join(__dirname, '../../email-templates/'),
        adapter: new  HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    TypeOrmModule.forFeature([CashEntity, Community, District, County, TransactionEntity]),
    HttpModule,
  ],

  providers: [
    EmailService,
    {
      provide: ConfigService,
      useValue: new ConfigService(`${join(__dirname, '../../env/')}${process.env.NODE_ENV || 'dev'}.env`,
      {
        partialPath: join(__dirname, '../../email-templates/partials/'),
      }),
    },
    AuthService,
    PostcodesApiService,
    FileService,
    YahooService,
    GoogleService,
    MSMailService,
    StripeService,
    DarkskysService,
    CashService,
    CommunityResolver,
    CommunityService,
  ],
  exports: [
    EmailService,
    AuthService,
    PostcodesApiService,
    ConfigService,
    FileService,
    YahooService,
    GoogleService,
    MSMailService,
    StripeService,
    CashService,
  ],
})
export class CommonModule {}
