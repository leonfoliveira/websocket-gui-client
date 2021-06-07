import React from 'react';

import { useWsHistory } from '@/presentation/atoms';
import { useAutoScroll } from '@/presentation/helpers';

import MessageEvent from '../message-event/message-event';

import styles from './history-view.module.scss';

const HistoryView: React.FC = () => {
  const history = useWsHistory();
  const autoScroll = useAutoScroll(history.events);

  return (
    <div className={styles.view}>
      <div className={styles.overflow}>
        <ul className={styles.eventList} role="menu">
          {history.events.map((event) => (
            <MessageEvent
              key={event.key}
              event={event}
              onDelete={history.delete}
              onClick={history.select}
            />
          ))}
          <span ref={autoScroll} />
        </ul>
      </div>
      <button type="button" className={styles.clearButton} onClick={history.clear}>
        clear
      </button>
    </div>
  );
};

export default HistoryView;
