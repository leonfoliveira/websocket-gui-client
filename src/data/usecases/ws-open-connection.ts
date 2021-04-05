import { OpenConnection } from '@/domain/usecases';

import { WsClient } from './ws-client';

export class WsOpenConnection implements OpenConnection {
  open(url: string, options: OpenConnection.Options = {}): void {
    WsClient.setClient(url);

    const client = WsClient.getClient();

    client.onopen = options.onopen;
    client.onclose = options.onclose;
    client.onmessage = (ev): void => {
      if (options.onevent) {
        options.onevent({
          key: ev.lastEventId,
          message: ev.data,
          time: new Date(ev.timeStamp * 1000),
        });
      }
    };
    client.onerror = options.onerror;
  }
}
