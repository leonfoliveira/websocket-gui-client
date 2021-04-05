import clsx from 'clsx';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useUsecase } from '@/presentation/contexts';
import { ConnectionStatus } from '@/presentation/helpers';

import styles from './dashboard.module.scss';

type FormType = {
  url: string;
};

const Dashboard: React.FC = () => {
  const { openConnection, closeConnection } = useUsecase();

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

  const handleOpenConnection = (data: FormType): void => {
    setConnectionStatus(ConnectionStatus.connecting);
    try {
      openConnection.open(data.url, {
        onopen: () => {
          setIsConnectionOpen(true);
          setConnectionStatus(ConnectionStatus.connected);
        },
        onclose: () => {
          setIsConnectionOpen(false);
          setConnectionStatus(ConnectionStatus.disconnected);
        },
      });
    } catch {
      setConnectionStatus(ConnectionStatus.disconnected);
    }
  };

  const handleCloseConnection = (): void => {
    closeConnection.close();
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
            }[connectionStatus],
          )}
          title={
            {
              [ConnectionStatus.connected]: 'Connected',
              [ConnectionStatus.connecting]: 'Connecting',
              [ConnectionStatus.disconnected]: 'Disconnected',
            }[connectionStatus]
          }
        />
        <form
          className={styles.form}
          onSubmit={handleSubmit(isConnectionOpen ? handleCloseConnection : handleOpenConnection)}
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
