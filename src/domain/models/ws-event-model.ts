export type WsEventModel = {
  key: string;
  time: Date;
  type: 'server-message' | 'client-message' | 'connection' | 'disconnection' | 'error';
  message?: string;
};
