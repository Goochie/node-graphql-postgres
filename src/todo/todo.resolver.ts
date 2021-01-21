import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { UseGuards, Req } from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { FromContextPipe } from '../common/from-context.pipe';
import { AuthService } from '../common/services/auth/auth.service';
import { User } from '../user/user.entity';
import { TodoOut } from './dto/todo-out';

@Resolver('Todo')
export class TodoResolver {
    constructor(private readonly todoService: TodoService, private readonly authSrv: AuthService) {}

    @Query(() => [TodoOut])
    async getTodo() {
        return this.todoService.findAll();
    }
}
