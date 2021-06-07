import clsx from 'clsx';
import React from 'react';

import { EventModel } from '@/domain/models';

import styles from './status-event.module.scss';

type PropTypes = {
  event: EventModel;
  text: string;
  variant: 'success' | 'error';
  onDelete: (event: EventModel) => void;
};

const StatusEvent: React.FC<PropTypes> = ({ event, text, variant, onDelete }) => {
  return (
    <li key={event.key} className={clsx(styles.event, styles[variant])}>
      <time className={styles.time}>{event.time.toISOString()}</time>
      <p className={styles.message}>{text}</p>
      <button type="button" className={styles.deleteButton} onClick={(): void => onDelete(event)}>
        X
      </button>
    </li>
  );
};

export default StatusEvent;
