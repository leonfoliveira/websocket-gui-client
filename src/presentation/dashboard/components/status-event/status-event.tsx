import clsx from 'clsx';
import React from 'react';

import { WsEventModel } from '@/domain/models';
import { WsEventHandler } from '@/domain/usecases';

import styles from './status-event.module.scss';

type PropTypes = {
  event: WsEventModel;
  text: string;
  variant: 'success' | 'error';
  onDelete: WsEventHandler;
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
