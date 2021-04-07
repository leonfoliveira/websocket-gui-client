import clsx from 'clsx';
import React, { useRef, useState } from 'react';

import { EventModel } from '@/domain/models';
import { useUsecase } from '@/presentation/contexts';
import { ConnectionStatus } from '@/presentation/helpers';

import { ConnectionHeader, MessageEditor } from './components';
import styles from './dashboard.module.scss';

const Dashboard: React.FC = () => {
  const { openConnection, closeConnection, sendEvent } = useUsecase();

  const [isConnectionOpen, setIsConnectionOpen] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.disconnected,
  );

  const [events, setEvents] = useState<EventModel[]>([]);
  const scrollBottom = useRef<HTMLSpanElement>(null);

  const pushEvent = (event: EventModel): void => {
    setEvents((currentState) => [...currentState, event]);
    const { top } = scrollBottom.current.getBoundingClientRect();
    if (top - 100 <= window.innerHeight)
      scrollBottom.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const handleSendEvent = (message: string): void => {
    const clientEvent = sendEvent.send(message);
    pushEvent(clientEvent);
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
            <ul className={styles.eventList} />
          </div>
          <MessageEditor
            isDisabled={connectionStatus !== ConnectionStatus.connected}
            handleSendEvent={handleSendEvent}
          />
        </div>
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
              <span ref={scrollBottom} />
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
