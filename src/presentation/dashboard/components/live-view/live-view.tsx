import React from 'react';

import { useWsEvents } from '@/presentation/atoms';
import { useAutoScroll } from '@/presentation/helpers';

import MessageEvent from '../message-event/message-event';
import StatusEvent from '../status-event/status-event';

import styles from './live-view.module.scss';

const LiveView: React.FC = () => {
  const wsEvents = useWsEvents();
  const autoScroll = useAutoScroll(wsEvents.events);

  return (
    <div className={styles.content}>
      <div className={styles.overflow}>
        <ul className={styles.eventList}>
          {wsEvents.events.map((event) =>
            event.type === 'client-message' || event.type === 'server-message' ? (
              <MessageEvent
                key={event.key}
                event={event}
                onDelete={wsEvents.delete}
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
                onDelete={wsEvents.delete}
              />
            ),
          )}
          <span ref={autoScroll} />
        </ul>
      </div>
      <button type="button" className={styles.clearButton} onClick={wsEvents.clear}>
        clear
      </button>
    </div>
  );
};

export default LiveView;
