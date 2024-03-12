import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, logLevel } from 'kafkajs';
import { KafkaPubSub } from 'graphql-kafkajs-subscriptions';

@Injectable()
export class KafkaPubSubService implements OnModuleInit {
  private pubsub: KafkaPubSub;

  constructor() {}

  async onModuleInit() {
    await this.initializePubSub();
  }

  private async initializePubSub(): Promise<void> {
    const kafka = new Kafka({
      logLevel: logLevel.ERROR,
      clientId: 'strl-prc',
      brokers: ['localhost:9092'],
      connectionTimeout: 25000,
      retry: {
        retries: 3,
        maxRetryTime: 3000,
      },
    });

    this.pubsub = await KafkaPubSub.create({
      kafka,
      topic: 'strl-prc-event',
      groupIdPrefix: 'strl-prc-group',
    });
  }

  getPubSub(): KafkaPubSub {
    if (!this.pubsub) {
      throw new Error('PubSub is not initialized');
    }
    return this.pubsub;
  }
}
