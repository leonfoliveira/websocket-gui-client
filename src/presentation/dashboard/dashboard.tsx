import React from 'react';
import { useForm } from 'react-hook-form';

import {
  WsConnectionStatus,
  useWsConnection,
  useWsEvents,
  useWsHistory,
} from '@/presentation/atoms';
import { useUsecase } from '@/presentation/contexts';

import { ConnectionHeader, MessageEditor, EditFormType, LiveView, HistoryView } from './components';
import styles from './dashboard.module.scss';

const Dashboard: React.FC = () => {
  const editForm = useForm<EditFormType>();
  const { wsSendMessage } = useUsecase();
  const connection = useWsConnection();
  const wsEvents = useWsEvents();
  const wsHistory = useWsHistory();

  const handleSendEvent = (message: string): void => {
    const clientEvent = wsSendMessage.send(message);
    wsEvents.push(clientEvent);
    wsHistory.push(clientEvent);
  };

  return (
    <main className={styles.dashboard}>
      <ConnectionHeader eventHandler={wsEvents.push} />
      <div className={styles.content}>
        <div className={styles.sider}>
          <HistoryView />
          <MessageEditor
            form={editForm}
            isDisabled={connection.status !== WsConnectionStatus.connected}
            handleSendEvent={handleSendEvent}
          />
        </div>
        <div className={styles.sider}>
          <LiveView />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
