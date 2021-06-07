import clsx from 'clsx';
import React from 'react';
import { useForm } from 'react-hook-form';

import { EventModel } from '@/domain/models';
import { ConnectionStatus, useConnection } from '@/presentation/atoms';

import styles from './connection-header.module.scss';

type FormType = {
  url: string;
};

type PropTypes = {
  eventHandler: (event: EventModel) => void;
};

const ConnectionHeader: React.FC<PropTypes> = ({ eventHandler }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      url: 'ws://',
    },
  });
  const connection = useConnection();

  const handleOpenConnection = (url: string): void => connection.open(url, eventHandler);

  const handleCloseConnection = connection.close;

  return (
    <header className={styles.header}>
      <div
        className={clsx(
          styles.status,
          {
            [ConnectionStatus.connected]: styles.connected,
            [ConnectionStatus.connecting]: styles.connecting,
            [ConnectionStatus.disconnected]: styles.disconnected,
          }[connection.status],
        )}
        title={
          {
            [ConnectionStatus.connected]: 'Connected',
            [ConnectionStatus.connecting]: 'Connecting',
            [ConnectionStatus.disconnected]: 'Disconnected',
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
          className={clsx(styles.input, errors.url && styles.error)}
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
