import { KeyGenerator } from '@/data/interfaces';
import { WsEventModel } from '@/domain/models';
import { WsOpenConnection, Listeners, WsEventHandler } from '@/domain/usecases';

import { ApiWsClient } from './api-ws-client';

export class ApiWsOpenConnection implements WsOpenConnection {
  constructor(private readonly keyGenerator: KeyGenerator) {}

  open(url: string, listeners: Listeners = {}): void {
    ApiWsClient.setClient(url);

    const client = ApiWsClient.getClient();

    client.onopen = this.adapt(listeners.onConnection, 'connection');
    client.onclose = this.adapt(listeners.onDisconnection, 'disconnection') as () => void;
    client.onmessage = this.adapt(listeners.onMessage, 'server-message');
    client.onerror = this.adapt(listeners.onError, 'error');
  }

  private adapt(listener: WsEventHandler, type: WsEventModel['type']): (ev: MessageEvent) => void {
    return listener
      ? (ev: MessageEvent): void => {
          listener({
            key: this.keyGenerator.generate(),
            time: new Date(),
            type,
            message: ev.data,
          });
        }
      : null;
  }
}
