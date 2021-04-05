import { EventModel } from '@/domain/models';

export interface OpenConnection {
  open: (url: string, listeners?: Listeners) => void;
}

export type Listeners = {
  onopen?: () => void;
  onclose?: () => void;
  onevent?: (event: EventModel) => void;
  onerror?: () => void;
};
