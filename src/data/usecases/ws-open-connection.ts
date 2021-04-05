import { KeyGenerator } from '@/data/interfaces';
import { OpenConnection, Listeners } from '@/domain/usecases';

import { WsClient } from './ws-client';

export class WsOpenConnection implements OpenConnection {
  constructor(private readonly keyGenerator: KeyGenerator) {}

  open(url: string, listeners: Listeners = {}): void {
    WsClient.setClient(url);

    const client = WsClient.getClient();

    client.onopen = listeners.onopen;
    client.onclose = listeners.onclose;
    client.onmessage = listeners.onevent
      ? (ev): void => {
          listeners.onevent({
            key: this.keyGenerator.generate(),
            message: ev.data,
            time: new Date(),
          });
        }
      : null;
    client.onerror = listeners.onerror;
  }
}
