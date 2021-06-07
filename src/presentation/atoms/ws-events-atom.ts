import { atom, useRecoilState } from 'recoil';

import { WsEventModel } from '@/domain/models';
import { WsEventHandler } from '@/domain/usecases';

export const wsEventsState = atom({
  key: 'wsEventsState',
  default: [] as WsEventModel[],
});

type HookReturnType = {
  events: WsEventModel[];
  push: WsEventHandler;
  delete: WsEventHandler;
  clear: () => void;
};

export const useWsEvents = (): HookReturnType => {
  const [events, setEvents] = useRecoilState(wsEventsState);

  const handlePushEvent = (event: WsEventModel): void => {
    setEvents((currVal) => [...currVal, event]);
  };

  const handleDeleteEvent = (event: WsEventModel): void => {
    setEvents((currVal) => currVal.filter((ev) => ev.key !== event.key));
  };

  const handleClearEvents = (): void => setEvents([]);

  return {
    events,
    push: handlePushEvent,
    delete: handleDeleteEvent,
    clear: handleClearEvents,
  };
};
