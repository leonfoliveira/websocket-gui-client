import clsx from 'clsx';
import React from 'react';

import { WsEventModel } from '@/domain/models';
import { WsEventHandler } from '@/domain/usecases';

import styles from './status-event.module.scss';

type PropTypes = {
  event: WsEventModel;
  onDelete: WsEventHandler;
};

const StatusEvent: React.FC<PropTypes> = ({ event, onDelete }) => (
  <li
    key={event.key}
    className={clsx(
      styles.event,
      styles[event.type === 'connection' ? 'event--success' : 'event--error'],
    )}
  >
    <time className={styles.time}>{event.time.toISOString()}</time>
    <p className={styles.message}>
      {
        {
          connection: 'Connected',
          disconnection: 'Disconnected',
          error: 'Connection Error',
        }[event.type]
      }
    </p>
    <button type="button" className={styles.deleteButton} onClick={(): void => onDelete(event)}>
      X
    </button>
  </li>
);

export default StatusEvent;
