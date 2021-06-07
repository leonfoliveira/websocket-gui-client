import { EventModel } from '@/domain/models';

export interface OpenConnection {
  open: (url: string, listeners?: Listeners) => void;
}

export type Listeners = {
  onopen?: EventHandler;
  onclose?: EventHandler;
  onevent?: EventHandler;
  onerror?: EventHandler;
};

export type EventHandler = (event: EventModel) => void;
