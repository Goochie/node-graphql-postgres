import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([Todo]),
      HttpModule,
      CommonModule,
    ],
    providers: [TodoResolver, TodoService],
    exports: [TodoService],
})
export class TodoModule {}
