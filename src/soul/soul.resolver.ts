import {Query, Resolver} from '@nestjs/graphql';
import {HttpService} from '@nestjs/common';
import {CircadianService} from './circadian/circadian.service';

@Resolver('Soul')
export class SoulResolver {
    constructor(private readonly circadianService: CircadianService) {
    }

    @Query(() => String)
    async helloSoul() {
        return await 'this is your soul --';
    }

    @Query(() => String)
    async circadianRhythm() {

        // return await circadianService.getCircadianRythem();

    }
}
