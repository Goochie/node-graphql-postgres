import { Resolver, Args, Query } from '@nestjs/graphql';
import { OccuranceService } from './occurance.service';
import { OccuranceOut } from './dto/occurance.dto';

@Resolver('Occurance')
export class OccuranceResolver {
  constructor(
    private occuranceSrv: OccuranceService,
  ) { }

  @Query(() => [OccuranceOut])

  async getOccurances() {
    return await this.occuranceSrv.getOccurances();
  }
}
