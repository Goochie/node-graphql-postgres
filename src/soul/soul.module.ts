import {HttpModule, Module} from '@nestjs/common';
import {SoulResolver} from './soul.resolver';

import { CircadianService } from './circadian/circadian.service';

@Module({
    providers: [SoulResolver, HttpModule, CircadianService],
})
export class SoulModule {
}
