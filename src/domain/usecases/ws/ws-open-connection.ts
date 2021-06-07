import { WsEventModel } from '@/domain/models';

export interface WsOpenConnection {
  open: (url: string, listeners?: Listeners) => void;
}

export type Listeners = {
  onConnection?: WsEventHandler;
  onDisconnection?: WsEventHandler;
  onMessage?: WsEventHandler;
  onError?: WsEventHandler;
};

export type WsEventHandler = (event: WsEventModel) => void;
