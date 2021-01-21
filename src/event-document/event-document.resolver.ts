import { Resolver, Context, Mutation, Args } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { FromContextPipe } from '../common/from-context.pipe';
import { UseGuards } from '@nestjs/common';
import { EventDocumentService } from './event-document.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { Int } from 'type-graphql';
import { EventDocumentOut } from './dto/event-document.dto';

@Resolver('EventDocument')
export class EventDocumentResolver {
  constructor(private readonly docSrv: EventDocumentService) {
  }

  @Mutation(() => EventDocumentOut)
  @UseGuards(JwtGuard)
  async uploadDocument(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => GraphQLUpload, name: 'file', nullable: true}) file: FileUpload,
    @Args({type: () => String, name: 'filename', nullable: true}) filename: string,
    @Args({type: () => Int, name: 'filesize', nullable: true}) filesize: number,
    @Args({type: () => String, name: 'filetype', nullable: true}) filetype: string,
  ) {
    return this.docSrv.uploadDocument(user.id, file, filename, filesize, filetype);
  }
}
