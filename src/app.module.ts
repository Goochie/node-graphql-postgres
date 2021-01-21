import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import * as Sentry from '@sentry/node';
import * as jwt from 'jsonwebtoken';
import { GraphQLExtension } from 'graphql-extensions';

import { UserModule } from './user/user.module';
import {join} from 'path';
import { CommonModule } from './common/common.module';
import { PostcodeModule } from './postcode/postcode.module';
import { RecurringModule } from './recurring/recurring.module';
import { SoulModule } from './soul/soul.module';
import { CategoriesModule } from './categories/categories.module';
import { OrganisationModule } from './organisation/organisation.module';
import { ThemeImagesModule } from './theme-images/theme-images.module';
import { GraphQLUpload } from 'apollo-server-core';
import { OccuranceModule } from './occurance/occurance.module';
import { EventModule } from './event/event.module';
import { EventDocumentModule } from './event-document/event-document.module';
import { FundModule } from './fund/fund.module';
import { UpdateModule } from './updates/updates.module';
import { ReviewModule } from './review/review.module';
import { FriendshipModule } from './friendship/friendship.module';
import { MessageModule } from './message/message.module';
import { TodoModule } from './todo/todo.module';
import { NotificationModule } from './notification/notification.module';
import { PubSub } from 'graphql-subscriptions';
import { ProductModule } from './product/product.module';
import { ConfigService } from './common/services/config.service';
import { GraphQLError } from 'graphql';
import * as _ from 'lodash';
import { JwtPayload } from './common/dto/jwt.payload';
import { BuyeraddressModule } from './buyeraddress/buyeraddress.module';
import { RequestModule } from './request/request.module';

const config = new ConfigService(`${join(__dirname, '../env/')}${process.env.NODE_ENV || 'dev'}.env`, {
  partialPath: join(__dirname, '../email-templates/partials/'),
});

Sentry.init({
  dsn: config.get('SENTRY_DNS'),
  debug: true,
  environment: process.env.NODE_ENV || 'dev',
  logLevel: 1,
});
// tslint:disable-next-line:max-classes-per-file
@Module({
  imports: [
      TypeOrmModule.forRoot(),
      GraphQLModule.forRoot({
          autoSchemaFile: 'schema.gql',
          playground: true,
          definitions: {
              path: join(process.cwd(), 'src/graphql.ts'),
              outputAs: 'class',
          },
          subscriptions: {
            path: '/subscriptions',
            keepAlive: 30000,
          },
          uploads: {
            maxFileSize: 10000000,
            maxFiles: 1,
          },
          resolvers: { Upload: GraphQLUpload },
          installSubscriptionHandlers: true,
          context: ({req}) => ({req}),
          debug: (process.env.NODE_ENV || 'dev') !== 'prod',
          formatResponse(resp, context) {
            if (resp.errors) {
              const auth = jwt.decode(context.request.http.headers.get('access-token')) || {};
              resp.errors.forEach(error => {
                Sentry.withScope((scope) => {
                  const {
                    path,
                    body,
                    status,
                    errorParse,
                    code,
                  } = error.extensions.errorData;
                  scope.setTag('path', path);
                  scope.setTag('code', code);
                  scope.setLevel((status >= 400 && status < 500) ? Sentry.Severity.Info : Sentry.Severity.Error);
                  scope.setExtra('body', body);
                  scope.setExtra('variables', JSON.stringify(context.request.variables));
                  scope.setUser({email: auth.email, id: auth.id});
                  Sentry.captureException(errorParse);
                });
              });
            }
            return resp;
          },
          formatError: (error: GraphQLError) => {
            console.log(error);

            const status = _.get(error, 'message.statusCode') || _.get(error, 'originalError.status');
            error.extensions.status = status;

            const path = error.path || _.get(error, 'originalError.path');
            let body: any = _.get(error, 'source.body') || _.get(error, 'originalError.source.body');
            try {
              body = JSON.stringify(body);
            // tslint:disable-next-line:no-empty
            } catch (e) {}

            let errorParse = error.originalError;
            if (!(error.originalError instanceof Error)) {
              errorParse = new Error(error.name);
              errorParse.message = _.get(error, 'originalError.message') || errorParse.message;
              errorParse.stack = _.get(error, 'originalError.stack');
            }

            error.extensions.errorData = {
              body,
              status,
              errorParse,
              code: _.get(error, 'extensions.code'),
              path: JSON.stringify(path),
            };

            if (!status) {
              if (_.get(error, 'extensions.code') !== 'GRAPHQL_VALIDATION_FAILED') {
                _.set(error, 'extensions.exception', {});
              } else {
                Sentry.withScope((scope) => {
                  scope.setTag('path', path);
                  scope.setTag('code', _.get(error, 'extensions.code'));
                  scope.setLevel((status > 400 && status < 499) ? Sentry.Severity.Info : Sentry.Severity.Error);
                  scope.setExtra('body', body);
                  Sentry.captureException(errorParse);
                });
              }
              error.message = 'Something went wrong';
            }
            return error;
          },
        }),
      TodoModule,
      UserModule,
      CommonModule,
      SoulModule,
      PostcodeModule,
      RecurringModule,
      CategoriesModule,
      OrganisationModule,
      ThemeImagesModule,
      OccuranceModule,
      EventModule,
      EventDocumentModule,
      FundModule,
      UpdateModule,
      ReviewModule,
      FriendshipModule,
      MessageModule,
      NotificationModule,
      ProductModule,
      BuyeraddressModule,
      RequestModule,
      ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
})

export class AppModule {
}
