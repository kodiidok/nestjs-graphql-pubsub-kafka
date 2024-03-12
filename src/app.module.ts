import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { join } from 'path';
import { PostModule } from './post/post.module';
import { PubsubModule } from './pubsub/pubsub.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.url'),
      }),
      inject: [ConfigService],
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      subscriptions: {
        'graphql-ws': true, // this enables graphql subscriptions
      },
      include: [PostModule] // here we need to include relevent modules with entities that we need to consider for the graphql schema
    }),

    PostModule,

    PubsubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
