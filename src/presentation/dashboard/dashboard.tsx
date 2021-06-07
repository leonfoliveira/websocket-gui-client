import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { EventModel } from '@/domain/models';
import { ConnectionStatus, useConnection } from '@/presentation/atoms';
import { useUsecase } from '@/presentation/contexts';

import {
  ConnectionHeader,
  MessageEditor,
  EditFormType,
  MessageEvent,
  StatusEvent,
} from './components';
import styles from './dashboard.module.scss';

const Dashboard: React.FC = () => {
  const editForm = useForm<EditFormType>();
  const { sendEvent } = useUsecase();
  const connection = useConnection();

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
      <ConnectionHeader eventHandler={pushEvent} />
      <div className={styles.content}>
        <div className={styles.sider}>
          <div className={styles.content}>
            <div className={styles.overflow}>
              <ul className={styles.eventList} role="menu">
                {history.map((event) => (
                  <MessageEvent
                    key={event.key}
                    event={event}
                    onClick={handleCopyEvent}
                    onDelete={handleDeleteHistoryEvent}
                  />
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
            isDisabled={connection.status !== ConnectionStatus.connected}
            handleSendEvent={handleSendEvent}
          />
        </div>
        <div className={styles.sider}>
          <div className={styles.content}>
            <div className={styles.overflow}>
              <ul className={styles.eventList}>
                {events.map((event) =>
                  event.type === 'client-event' || event.type === 'server-event' ? (
                    <MessageEvent
                      key={event.key}
                      event={event}
                      onDelete={handleDeleteEvent}
                      align={event.type === 'client-event' ? 'right' : 'left'}
                    />
                  ) : (
                    <StatusEvent
                      key={event.key}
                      event={event}
                      text={
                        {
                          'connection-open': 'Connection Open',
                          'connection-close': 'Connection Closed',
                          error: 'Connection Error',
                        }[event.type]
                      }
                      variant={event.type === 'connection-open' ? 'success' : 'error'}
                      onDelete={handleDeleteEvent}
                    />
                  ),
                )}
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
