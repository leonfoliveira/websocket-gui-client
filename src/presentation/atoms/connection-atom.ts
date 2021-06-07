import { atom, useRecoilState } from 'recoil';

import { EventModel } from '@/domain/models';
import { EventHandler } from '@/domain/usecases';

import { useUsecase } from '../contexts';

export enum ConnectionStatus {
  disconnected,
  connecting,
  connected,
}

export const connectionState = atom({
  key: 'connectionState',
  default: {
    isOpen: false,
    status: ConnectionStatus.disconnected,
  },
});

export const useConnection = (): any => {
  const { openConnection, closeConnection } = useUsecase();

  const [{ isOpen, status }, setState] = useRecoilState(connectionState);

  const handleOpenConnection = (url: string, eventHandler: EventHandler): void => {
    setState({ isOpen: true, status: ConnectionStatus.connecting });
    try {
      openConnection.open(url, {
        onopen: (event: EventModel) => {
          eventHandler(event);
          setState({ isOpen: true, status: ConnectionStatus.connected });
        },
        onclose: (event: EventModel) => {
          eventHandler(event);
          setState({ isOpen: false, status: ConnectionStatus.disconnected });
        },
        onevent: eventHandler,
        onerror: eventHandler,
      });
    } catch {
      setState({ isOpen: false, status: ConnectionStatus.disconnected });
    }
  };

  const handleCloseConnection = (): void => closeConnection.close();

  return {
    isOpen,
    status,
    open: handleOpenConnection,
    close: handleCloseConnection,
  };
};
