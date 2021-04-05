import { EventModel } from '@/domain/models';

export interface OpenConnection {
  open: (url: string, options?: Options) => void;
}

export type Options = {
  onopen?: () => void;
  onclose?: () => void;
  onevent?: (event: EventModel) => void;
  onerror?: (error: string) => void;
};
