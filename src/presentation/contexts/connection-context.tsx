import React, { createContext, useContext, useState } from 'react';

import { EventModel } from '@/domain/models';

import { useUsecase } from './usecases-context';

export enum ConnectionStatus {
  disconnected,
  connecting,
  connected,
}

type ContextType = {
  isConnectionOpen: boolean;
  connectionStatus: ConnectionStatus;
  openConnection: (url: string, eventHandler: (event: EventModel) => void) => void;
  closeConnection: () => void;
};

const ConnectionContext = createContext<ContextType>(null);

export const ConnectionProvider: React.FC = ({ children }) => {
  const {
    openConnection: usecaseOpenConnection,
    closeConnection: usecaseCloseConnection,
  } = useUsecase();

  const [isConnectionOpen, setIsConnectionOpen] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.disconnected,
  );

  const handleOpenConnection = (url: string, eventHandler: (event: EventModel) => void): void => {
    setConnectionStatus(ConnectionStatus.connecting);
    try {
      usecaseOpenConnection.open(url, {
        onopen: (event: EventModel) => {
          eventHandler(event);
          setIsConnectionOpen(true);
          setConnectionStatus(ConnectionStatus.connected);
        },
        onclose: (event: EventModel) => {
          eventHandler(event);
          setIsConnectionOpen(false);
          setConnectionStatus(ConnectionStatus.disconnected);
        },
        onevent: eventHandler,
        onerror: eventHandler,
      });
    } catch {
      setConnectionStatus(ConnectionStatus.disconnected);
    }
  };

  const handleCloseConnection = (): void => usecaseCloseConnection.close();

  return (
    <ConnectionContext.Provider
      value={{
        isConnectionOpen,
        connectionStatus,
        openConnection: handleOpenConnection,
        closeConnection: handleCloseConnection,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = (): ContextType => useContext(ConnectionContext);
