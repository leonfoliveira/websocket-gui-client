import { atom, useRecoilState } from 'recoil';

import { WsEventModel } from '@/domain/models';
import { WsEventHandler } from '@/domain/usecases';

import { mergeState } from '../helpers';

export const wsHistoryState = atom({
  key: 'wsHistoryState',
  default: {
    events: [] as WsEventModel[],
    selectedEvent: null as WsEventModel,
  },
});

type HookReturnType = {
  events: WsEventModel[];
  selected: WsEventModel;
  push: WsEventHandler;
  delete: WsEventHandler;
  clear: () => void;
  select: WsEventHandler;
};

export const useWsHistory = (): HookReturnType => {
  const [state, setState] = useRecoilState(wsHistoryState);

  const handlePushEvent = (event: WsEventModel): void => {
    mergeState(setState, (currVal) => ({ events: [...currVal.events, event] }));
  };

  const handleDeleteEvent = (event: WsEventModel): void => {
    mergeState(setState, (currVal) => ({
      events: currVal.events.filter((ev) => ev.key !== event.key),
    }));
  };

  const handleClearEvents = (): void => mergeState(setState, { events: [] });

  const handleSelectEvent = (event: WsEventModel): void =>
    mergeState(setState, { selectedEvent: event });

  return {
    events: state.events,
    selected: state.selectedEvent,
    push: handlePushEvent,
    delete: handleDeleteEvent,
    clear: handleClearEvents,
    select: handleSelectEvent,
  };
};
