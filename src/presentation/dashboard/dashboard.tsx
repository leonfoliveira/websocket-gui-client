import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { WsEventModel } from '@/domain/models';
import { WsConnectionStatus, useWsConnection } from '@/presentation/atoms';
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
  const { wsSendMessage } = useUsecase();
  const connection = useWsConnection();

  const [events, setEvents] = useState<WsEventModel[]>([]);
  const [history, setHistory] = useState<WsEventModel[]>([]);
  const scrollBottom = useRef<HTMLSpanElement>(null);
  const historyScrollBottom = useRef<HTMLSpanElement>(null);

  const scrollToBottom = (element: HTMLElement): void => {
    const { top } = element.getBoundingClientRect();
    if (top - 100 <= window.innerHeight) element?.scrollIntoView({ behavior: 'smooth' });
  };

  const pushEvent = (event: WsEventModel): void => {
    setEvents((currentState) => [...currentState, event]);
    scrollToBottom(scrollBottom.current);
  };

  const pushHistory = (event: WsEventModel): void => {
    setHistory((currentState) => [...currentState, event]);
    scrollToBottom(historyScrollBottom.current);
  };

  const handleClearEvents = (): void => setEvents([]);

  const handleClearHistory = (): void => setHistory([]);

  const handleSendEvent = (message: string): void => {
    const clientEvent = wsSendMessage.send(message);
    pushEvent(clientEvent);
    pushHistory(clientEvent);
  };

  const handleCopyEvent = (event: WsEventModel): void => {
    editForm.setValue('message', event.message);
    editForm.trigger('message');
  };

  const handleDeleteHistoryEvent = (event: WsEventModel): void => {
    setHistory((currentValue) => currentValue.filter((ev) => ev.key !== event.key));
  };

  const handleDeleteEvent = (event: WsEventModel): void => {
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
            isDisabled={connection.status !== WsConnectionStatus.connected}
            handleSendEvent={handleSendEvent}
          />
        </div>
        <div className={styles.sider}>
          <div className={styles.content}>
            <div className={styles.overflow}>
              <ul className={styles.eventList}>
                {events.map((event) =>
                  event.type === 'client-message' || event.type === 'server-message' ? (
                    <MessageEvent
                      key={event.key}
                      event={event}
                      onDelete={handleDeleteEvent}
                      align={event.type === 'client-message' ? 'right' : 'left'}
                    />
                  ) : (
                    <StatusEvent
                      key={event.key}
                      event={event}
                      text={
                        {
                          connection: 'Connected',
                          disconnection: 'Disconnected',
                          error: 'Connection Error',
                        }[event.type]
                      }
                      variant={event.type === 'connection' ? 'success' : 'error'}
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
