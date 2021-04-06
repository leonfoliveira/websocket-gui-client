import { KeyGenerator } from '@/data/interfaces';
import { EventModel } from '@/domain/models';
import { OpenConnection, Listeners } from '@/domain/usecases';

import { WsClient } from './ws-client';

export class WsOpenConnection implements OpenConnection {
  constructor(private readonly keyGenerator: KeyGenerator) {}

  open(url: string, listeners: Listeners = {}): void {
    WsClient.setClient(url);

    const client = WsClient.getClient();

    client.onopen = this.adapt(listeners.onopen, 'connection-open');
    client.onclose = this.adapt(listeners.onclose, 'connection-close') as () => void;
    client.onmessage = this.adapt(listeners.onevent, 'server-event');
    client.onerror = this.adapt(listeners.onerror, 'error');
  }

  private adapt(
    listener: (event: EventModel) => void,
    type: EventModel['type'],
  ): (ev?: MessageEvent) => void {
    return listener
      ? (ev?: MessageEvent): void => {
          listener({
            key: this.keyGenerator.generate(),
            time: new Date(),
            type,
            message: ev?.data,
          });
        }
      : null;
  }
}
