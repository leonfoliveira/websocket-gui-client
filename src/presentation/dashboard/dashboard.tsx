import clsx from 'clsx';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { ConnectionStatus } from '@/presentation/helpers';

import styles from './dashboard.module.scss';

type FormType = {
  url: string;
};

const Dashboard: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      url: 'ws://',
    },
  });

  const [isConnectionOpen, setIsConnectionOpen] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.disconnected,
  );

  const openConnection = (data: FormType): void => {
    setIsConnectionOpen(true);
    setConnectionStatus(ConnectionStatus.connecting);
  };

  const closeConnection = (): void => {
    setIsConnectionOpen(false);
    setConnectionStatus(ConnectionStatus.disconnected);
  };

  return (
    <main className={styles.dashboard}>
      <header className={styles.header}>
        <div
          className={clsx(
            styles.status,
            {
              [ConnectionStatus.connected]: styles.connected,
              [ConnectionStatus.connecting]: styles.connecting,
              [ConnectionStatus.disconnected]: styles.disconnected,
              [ConnectionStatus.error]: styles.error,
            }[connectionStatus],
          )}
          title={
            {
              [ConnectionStatus.connected]: 'Connected',
              [ConnectionStatus.connecting]: 'Connecting',
              [ConnectionStatus.disconnected]: 'Disconnected',
              [ConnectionStatus.error]: 'Error',
            }[connectionStatus]
          }
        />
        <form
          className={styles.form}
          onSubmit={handleSubmit(isConnectionOpen ? closeConnection : openConnection)}
        >
          <input
            className={clsx(styles.input, errors.url && styles.error)}
            type="text"
            placeholder="URL"
            title={errors.url && 'Must be a valid url starting with ws:// or wss://'}
            {...register('url', { required: true, pattern: /^wss?:\/\// })}
            disabled={isConnectionOpen}
          />
          <button className={styles.submit} type="submit">
            {isConnectionOpen ? 'Close' : 'Open'}
          </button>
        </form>
      </header>
    </main>
  );
};

export default Dashboard;
