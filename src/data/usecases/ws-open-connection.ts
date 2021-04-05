import { KeyGenerator } from '@/data/interfaces';
import { OpenConnection } from '@/domain/usecases';

import { WsClient } from './ws-client';

export class WsOpenConnection implements OpenConnection {
  constructor(private readonly keyGenerator: KeyGenerator) {}

  open(url: string, options: OpenConnection.Options = {}): void {
    WsClient.setClient(url);

    const client = WsClient.getClient();

    client.onopen = options.onopen;
    client.onclose = options.onclose;
    client.onmessage = options.onevent
      ? (ev): void => {
          options.onevent({
            key: this.keyGenerator.generate(),
            message: ev.data,
            time: new Date(),
          });
        }
      : null;
    client.onerror = options.onerror;
  }
}
