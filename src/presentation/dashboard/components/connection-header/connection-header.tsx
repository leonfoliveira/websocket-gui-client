import clsx from 'clsx';
import React from 'react';
import { useForm } from 'react-hook-form';

import { WsConnectionStatus, useWsConnection, useWsEvents } from '@/presentation/atoms';

import styles from './connection-header.module.scss';

type FormType = {
  url: string;
};

const ConnectionHeader: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      url: 'ws://',
    },
  });
  const connection = useWsConnection();
  const wsEvents = useWsEvents();

  const handleOpenConnection = (url: string): void => connection.open(url, wsEvents.push);

  const handleCloseConnection = connection.close;

  return (
    <header className={styles.container}>
      <span
        className={clsx(
          styles.status,
          {
            [WsConnectionStatus.connected]: styles['status--connected'],
            [WsConnectionStatus.connecting]: styles['status--connecting'],
            [WsConnectionStatus.disconnected]: styles['status--disconnected'],
          }[connection.status],
        )}
        title={
          {
            [WsConnectionStatus.connected]: 'Connected',
            [WsConnectionStatus.connecting]: 'Connecting',
            [WsConnectionStatus.disconnected]: 'Disconnected',
          }[connection.status]
        }
      />
      <form
        className={styles.form}
        onSubmit={handleSubmit(
          connection.isOpen ? handleCloseConnection : ({ url }): void => handleOpenConnection(url),
        )}
      >
        <input
          className={clsx(styles.input, errors.url && styles['input--error'])}
          type="text"
          placeholder="URL"
          title={errors.url && 'Must be a valid url starting with ws:// or wss://'}
          {...register('url', { required: true, pattern: /^wss?:\/\/.+/ })}
          disabled={connection.isOpen}
          spellCheck="false"
        />
        <button className={styles.submit} type="submit">
          {connection.isOpen ? 'Close' : 'Open'}
        </button>
      </form>
    </header>
  );
};

export default ConnectionHeader;
