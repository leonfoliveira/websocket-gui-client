import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  useWsConnection,
  useWsEvents,
  useWsHistory,
  WsConnectionStatus,
} from '@/presentation/atoms';
import { useUsecase } from '@/presentation/contexts';

import styles from './message-editor.module.scss';

export type EditFormType = {
  message: string;
};

const MessageEditor: React.FC = () => {
  const form = useForm<EditFormType>();
  const { wsSendMessage } = useUsecase();
  const connection = useWsConnection();
  const history = useWsHistory();
  const wsEvents = useWsEvents();
  const wsHistory = useWsHistory();

  const handleSendEvent = (message: string): void => {
    const clientEvent = wsSendMessage.send(message);
    wsEvents.push(clientEvent);
    wsHistory.push(clientEvent);
  };

  useEffect(() => {
    if (!history.selected) return;
    form.setValue('message', history.selected.message);
    form.trigger('message');
  }, [history.selected]);

  return (
    <form
      className={styles.container}
      onSubmit={form.handleSubmit(({ message }): void => handleSendEvent(message))}
    >
      <input
        className={clsx(styles.input, form.formState.errors.message && styles.error)}
        placeholder="Message"
        {...form.register('message', { required: true })}
        spellCheck="false"
      />
      <footer className={styles.footer}>
        <button
          className={styles.submit}
          type="submit"
          disabled={connection.status !== WsConnectionStatus.connected}
        >
          Send
        </button>
      </footer>
    </form>
  );
};

export default MessageEditor;
