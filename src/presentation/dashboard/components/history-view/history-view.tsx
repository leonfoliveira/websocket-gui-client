import React, { useRef } from 'react';

import { useWsHistory } from '@/presentation/atoms';

import MessageEvent from '../message-event/message-event';

import styles from './history-view.module.scss';

const HistoryView: React.FC = () => {
  const history = useWsHistory();

  const scrollBottom = useRef<HTMLSpanElement>(null);

  return (
    <div className={styles.content}>
      <div className={styles.overflow}>
        <ul className={styles.eventList} role="menu">
          {history.events.map((event) => (
            <MessageEvent key={event.key} event={event} onDelete={history.delete} />
          ))}
          <span ref={scrollBottom} />
        </ul>
      </div>
      <button type="button" className={styles.clearButton} onClick={history.clear}>
        clear
      </button>
    </div>
  );
};

export default HistoryView;
