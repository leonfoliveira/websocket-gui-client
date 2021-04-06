import { EventModel } from '@/domain/models';
import { SendEvent } from '@/domain/usecases';

import { KeyGenerator } from '../interfaces';

import { WsClient } from './ws-client';

export class WsSendEvent implements SendEvent {
  constructor(private readonly keyGenerator: KeyGenerator) {}

  send(message: string): EventModel {
    WsClient.getClient().send(message);

    return {
      key: this.keyGenerator.generate(),
      time: new Date(),
      type: 'client-event',
      message,
    };
  }
}
