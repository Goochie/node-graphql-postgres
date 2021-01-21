
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { Repository, getManager } from 'typeorm';
import { Injectable, NotFoundException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { User } from '../user/user.entity';
import { EmailService } from '../common/services/email/email.service';
import { UserService } from '../user/user.service';
import { FriendOut } from '../user/dto/friend.out';
import { MessageService } from '../message/message.service';
import { text } from 'body-parser';
import { TodoOut } from './dto/todo-out';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>,
    ) {}

    async findAll(): Promise<TodoOut[]> {
      return await this.todoRepository.find();
    }
}
