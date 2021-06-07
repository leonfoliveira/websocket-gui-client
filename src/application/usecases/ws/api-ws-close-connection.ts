import { WsCloseConnection } from '@/domain/usecases';

import { ApiWsClient } from './api-ws-client';

export class ApiWsCloseConnection implements WsCloseConnection {
  close(): void {
    ApiWsClient.getClient().close();
  }
}
