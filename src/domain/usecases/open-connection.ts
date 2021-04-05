import { EventModel } from '@/domain/models';

export interface OpenConnection {
  open: (url: string, options?: OpenConnection.Options) => void;
}

export namespace OpenConnection {
  export type Options = {
    onopen?: () => void;
    onclose?: () => void;
    onevent?: (event: EventModel) => void;
    onerror?: () => void;
  };
}
