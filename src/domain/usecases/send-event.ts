import { EventModel } from '@/domain/models';

export interface SendEvent {
  send: (message: string) => EventModel;
}
