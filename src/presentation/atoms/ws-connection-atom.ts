import { atom, useRecoilState } from 'recoil';

import { WsEventModel } from '@/domain/models';
import { WsEventHandler } from '@/domain/usecases';

import { useUsecase } from '../contexts';

export enum WsConnectionStatus {
  disconnected,
  connecting,
  connected,
}

export const wsConnectionState = atom({
  key: 'wsConnectionState',
  default: {
    isOpen: false,
    status: WsConnectionStatus.disconnected,
  },
});

type HookReturnType = {
  isOpen: boolean;
  status: WsConnectionStatus;
  open: (url: string, eventHandler: WsEventHandler) => void;
  close: () => void;
};

export const useWsConnection = (): HookReturnType => {
  const { wsOpenConnection, wsCloseConnection } = useUsecase();

  const [{ isOpen, status }, setState] = useRecoilState(wsConnectionState);

  const handleOpenConnection = (url: string, eventHandler: WsEventHandler): void => {
    setState({ isOpen: true, status: WsConnectionStatus.connecting });
    try {
      wsOpenConnection.open(url, {
        onConnection: (event: WsEventModel) => {
          eventHandler(event);
          setState({ isOpen: true, status: WsConnectionStatus.connected });
        },
        onDisconnection: (event: WsEventModel) => {
          eventHandler(event);
          setState({ isOpen: false, status: WsConnectionStatus.disconnected });
        },
        onMessage: eventHandler,
        onError: eventHandler,
      });
    } catch {
      setState({ isOpen: false, status: WsConnectionStatus.disconnected });
    }
  };

  const handleCloseConnection = (): void => wsCloseConnection.close();

  return {
    isOpen,
    status,
    open: handleOpenConnection,
    close: handleCloseConnection,
  };
};
