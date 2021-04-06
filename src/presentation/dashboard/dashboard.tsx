import clsx from 'clsx';
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

  const pushEvent = (event: EventModel): void =>
    setEvents((currentState) => [...currentState, event]);

  const handleOpenConnection = (url: string): void => {
    setConnectionStatus(ConnectionStatus.connecting);
    try {
      openConnection.open(url, {
        onopen: (event: EventModel) => {
          pushEvent(event);
          setIsConnectionOpen(true);
          setConnectionStatus(ConnectionStatus.connected);
        },
        onclose: (event: EventModel) => {
          pushEvent(event);
          setIsConnectionOpen(false);
          setConnectionStatus(ConnectionStatus.disconnected);
        },
        onevent: pushEvent,
        onerror: pushEvent,
      });
    } catch {
      setConnectionStatus(ConnectionStatus.disconnected);
    }
  };

  const handleCloseConnection = (): void => closeConnection.close();

  const handleClearEvents = (): void => setEvents([]);

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
                <li key={event.key} className={clsx(styles.event, styles[event.type])}>
                  <time className={styles.time}>{event.time.toISOString()}</time>
                  <p className={styles.message}>
                    {{
                      'connection-open': 'Connection Open',
                      'connection-close': 'Connection Closed',
                      error: 'Connection Error',
                    }[event.type] || event.message}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <button type="button" className={styles.clearButton} onClick={handleClearEvents}>
            clear
          </button>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
