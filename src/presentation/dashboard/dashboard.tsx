import React, { useState } from 'react';

import { EventModel } from '@/domain/models';
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

  const [events, setEvents] = useState<EventModel[]>([]);

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
        onevent: (event: EventModel) => {
          setEvents((currentState) => [...currentState, event]);
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
      <div className={styles.content}>
        <div className={styles.sider}>
          <div className={styles.overflow}>
            <ul className={styles.eventList}>
              {events.map((event) => (
                <li key={event.key} className={styles.event}>
                  <time className={styles.time}>{event.time.toISOString()}</time>
                  <code className={styles.message}>{event.message}</code>
                </li>
              ))}
            </ul>
          </div>
          <button type="button" className={styles.clearButton}>
            clear
          </button>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
