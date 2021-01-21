
import { InjectRepository } from '@nestjs/typeorm';
import { CashEntity } from '../cash/cash.entity';
import { Repository } from 'typeorm';

export class CashService {
    constructor(
      @InjectRepository(CashEntity)
      private readonly repository: Repository<CashEntity>,
    ) {
    }

    async get<T>(key: string, alive: number = 1000 * 60 * 10): Promise<T> {
      const cash = await this.repository.findOne({where: {key}});
      if (!cash || +cash.updatedDate < Date.now() - alive) {
        await this.repository.delete({key});
        return null;
      }
      return cash.data;
    }

    async clear<T>(key: string): Promise<void> {
      await this.repository.delete({key});
    }

    async set<T>(key: string, data: T): Promise<void> {
      await this.repository.save({key, data});
    }
}
