import { Injectable, BadRequestException } from '@nestjs/common';
import { Recurring } from './recurring.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, IsNull } from 'typeorm';

export const MILLE = 1609.344;
@Injectable()
export class RecurringService {
  constructor(
    @InjectRepository(Recurring)
    private readonly recurringRepository: Repository<Recurring>,
  ) {}

  async create(recurring: Recurring, transactionalEntityManager: EntityManager) {
    const find = await transactionalEntityManager.save(Recurring, recurring);
    return find;
  }

  async delete(id: number) {
    return this.recurringRepository.update({id}, {deletedDate: new Date()})
  }

}