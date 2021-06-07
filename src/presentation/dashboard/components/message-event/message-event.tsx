import clsx from 'clsx';
import React from 'react';

import { EventModel } from '@/domain/models';

import styles from './message-event.module.scss';

type PropTypes = {
  event: EventModel;
  onClick?: (event: EventModel) => void;
  onDelete: (event: EventModel) => void;
  align?: 'left' | 'right';
};

const MessageEvent: React.FC<PropTypes> = ({ event, onClick, onDelete, align }) => {
  return (
    <li className={clsx(styles.event, align === 'right' && styles['--right'])}>
      {onClick ? (
        <button className={styles.action} type="button" onClick={(): void => onClick(event)}>
          <time className={styles.time}>{event.time.toISOString()}</time>
          <p className={styles.message}>{event.message}</p>
        </button>
      ) : (
        <>
          <time className={styles.time}>{event.time.toISOString()}</time>
          <p className={styles.message}>{event.message}</p>
        </>
      )}
      <button type="button" className={styles.deleteButton} onClick={(): void => onDelete(event)}>
        X
      </button>
    </li>
  );
};

export default MessageEvent;
