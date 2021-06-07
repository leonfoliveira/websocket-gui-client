import { KeyGenerator } from '@/application/interfaces';
import { WsEventModel } from '@/domain/models';
import { WsSendMessage } from '@/domain/usecases';

import { ApiWsClient } from './api-ws-client';

export class ApiWsSendMessage implements WsSendMessage {
  constructor(private readonly keyGenerator: KeyGenerator) {}

  send(message: string): WsEventModel {
    ApiWsClient.getClient().send(message);

    return {
      key: this.keyGenerator.generate(),
      time: new Date(),
      type: 'client-message',
      message,
    };
  }
}
