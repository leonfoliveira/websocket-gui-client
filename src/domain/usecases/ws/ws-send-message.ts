import { WsEventModel } from '@/domain/models';

export interface WsSendMessage {
  send: (message: string) => WsEventModel;
}
