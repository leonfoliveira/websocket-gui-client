import clsx from 'clsx';
import React from 'react';

import { WsEventModel } from '@/domain/models';
import { WsEventHandler } from '@/domain/usecases';

import styles from './message-event.module.scss';

type PropTypes = {
  event: WsEventModel;
  onClick?: WsEventHandler;
  onDelete: WsEventHandler;
  align?: 'left' | 'right';
};

const MessageEvent: React.FC<PropTypes> = ({ event, onClick, onDelete, align }) => (
  <li className={clsx(styles.event, align === 'right' && styles['event--right'])}>
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

export default MessageEvent;
