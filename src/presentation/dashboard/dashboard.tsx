import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { EventModel } from '@/domain/models';
import { useUsecase } from '@/presentation/contexts';
import { ConnectionStatus } from '@/presentation/helpers';

import { ConnectionHeader, MessageEditor, EditFormType } from './components';
import styles from './dashboard.module.scss';

const Dashboard: React.FC = () => {
  const editForm = useForm<EditFormType>();
  const { openConnection, closeConnection, sendEvent } = useUsecase();

  const [isConnectionOpen, setIsConnectionOpen] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.disconnected,
  );

  const [events, setEvents] = useState<EventModel[]>([]);
  const [history, setHistory] = useState<EventModel[]>([]);
  const scrollBottom = useRef<HTMLSpanElement>(null);
  const historyScrollBottom = useRef<HTMLSpanElement>(null);

  const scrollToBottom = (element: HTMLElement): void => {
    const { top } = element.getBoundingClientRect();
    if (top - 100 <= window.innerHeight) element?.scrollIntoView({ behavior: 'smooth' });
  };

  const pushEvent = (event: EventModel): void => {
    setEvents((currentState) => [...currentState, event]);
    scrollToBottom(scrollBottom.current);
  };

  const pushHistory = (event: EventModel): void => {
    setHistory((currentState) => [...currentState, event]);
    scrollToBottom(historyScrollBottom.current);
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

  const handleClearHistory = (): void => setHistory([]);

  const handleSendEvent = (message: string): void => {
    const clientEvent = sendEvent.send(message);
    pushEvent(clientEvent);
    pushHistory(clientEvent);
  };

  const handleCopyEvent = (event: EventModel): void => {
    editForm.setValue('message', event.message);
    editForm.trigger('message');
  };

  const handleDeleteHistoryEvent = (event: EventModel): void => {
    setHistory((currentValue) => currentValue.filter((ev) => ev.key !== event.key));
  };

  const handleDeleteEvent = (event: EventModel): void => {
    setEvents((currentValue) => currentValue.filter((ev) => ev.key !== event.key));
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
          <div className={styles.content}>
            <div className={styles.overflow}>
              <ul className={styles.eventList} role="menu">
                {history.map((event) => (
                  <li key={event.key} role="menuitem" className={styles.event}>
                    <button
                      className={styles.action}
                      type="button"
                      onClick={(): void => handleCopyEvent(event)}
                    >
                      <time className={styles.time}>{event.time.toISOString()}</time>
                      <p className={styles.message}>{event.message}</p>
                    </button>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={(): void => handleDeleteHistoryEvent(event)}
                    >
                      X
                    </button>
                  </li>
                ))}
                <span ref={historyScrollBottom} />
              </ul>
            </div>
            <button type="button" className={styles.clearButton} onClick={handleClearHistory}>
              clear
            </button>
          </div>
          <MessageEditor
            form={editForm}
            isDisabled={connectionStatus !== ConnectionStatus.connected}
            handleSendEvent={handleSendEvent}
          />
        </div>
        <div className={styles.sider}>
          <div className={styles.content}>
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
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={(): void => handleDeleteEvent(event)}
                    >
                      X
                    </button>
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
      </div>
    </main>
  );
};

export default Dashboard;
