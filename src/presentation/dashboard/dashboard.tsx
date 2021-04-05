import React, { useState } from 'react';

import { useUsecase } from '@/presentation/contexts';
import { ConnectionStatus } from '@/presentation/helpers';

import { ConnectionHeader } from './components';
import styles from './dashboard.module.scss';

const Dashboard: React.FC = () => {
  const { openConnection, closeConnection } = useUsecase();

  const [isConnectionOpen, setIsConnectionOpen] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.disconnected,
  );

  const handleOpenConnection = (url: string): void => {
    setConnectionStatus(ConnectionStatus.connecting);
    try {
      openConnection.open(url, {
        onopen: () => {
          setIsConnectionOpen(true);
          setConnectionStatus(ConnectionStatus.connected);
        },
        onclose: () => {
          setIsConnectionOpen(false);
          setConnectionStatus(ConnectionStatus.disconnected);
        },
      });
    } catch {
      setConnectionStatus(ConnectionStatus.disconnected);
    }
  };

  const handleCloseConnection = (): void => {
    closeConnection.close();
  };

  return (
    <main className={styles.dashboard}>
      <ConnectionHeader
        isConnectionOpen={isConnectionOpen}
        connectionStatus={connectionStatus}
        handleOpenConnection={handleOpenConnection}
        handleCloseConnection={handleCloseConnection}
      />
    </main>
  );
};

export default Dashboard;
