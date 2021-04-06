export type EventModel = {
  key: string;
  time: Date;
  type: 'server-event' | 'client-event' | 'connection-open' | 'connection-close' | 'error';
  message?: string;
};
