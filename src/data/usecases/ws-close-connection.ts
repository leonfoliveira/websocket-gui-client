import { CloseConnection } from '@/domain/usecases';

import { WsClient } from './ws-client';

export class WsCloseConnection implements CloseConnection {
  close(): void {
    WsClient.getClient().close();
  }
}
