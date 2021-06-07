import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { WsEventModel } from '@/domain/models';
import { WsConnectionStatus, useWsConnection, useWsEvents } from '@/presentation/atoms';
import { useUsecase } from '@/presentation/contexts';

import {
  ConnectionHeader,
  MessageEditor,
  EditFormType,
  MessageEvent,
  LiveView,
} from './components';
import styles from './dashboard.module.scss';

const Dashboard: React.FC = () => {
  const editForm = useForm<EditFormType>();
  const { wsSendMessage } = useUsecase();
  const connection = useWsConnection();
  const wsEvents = useWsEvents();

  const [history, setHistory] = useState<WsEventModel[]>([]);
  const historyScrollBottom = useRef<HTMLSpanElement>(null);

  const scrollToBottom = (element: HTMLElement): void => {
    const { top } = element.getBoundingClientRect();
    if (top - 100 <= window.innerHeight) element?.scrollIntoView({ behavior: 'smooth' });
  };

  const pushEvent = (event: WsEventModel): void => {
    wsEvents.push(event);
  };

  const pushHistory = (event: WsEventModel): void => {
    setHistory((currentState) => [...currentState, event]);
    scrollToBottom(historyScrollBottom.current);
  };

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
          <LiveView />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
