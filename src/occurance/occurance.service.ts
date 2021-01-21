import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Occurance } from './occurance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OccuranceService {
  constructor(
    @InjectRepository(Occurance)
    private readonly occuranceRepository: Repository<Occurance>,
  ) {}

  getOccurances() {
    return this.occuranceRepository.find();
  }
}
