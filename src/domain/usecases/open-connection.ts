import { EventModel } from '@/domain/models';

export interface OpenConnection {
  open: (url: string, listeners?: Listeners) => void;
}

export type Listeners = {
  onopen?: (event: EventModel) => void;
  onclose?: (event: EventModel) => void;
  onevent?: (event: EventModel) => void;
  onerror?: (event: EventModel) => void;
};
