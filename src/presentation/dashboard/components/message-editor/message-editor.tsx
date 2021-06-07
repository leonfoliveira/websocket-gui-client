import clsx from 'clsx';
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { useWsHistory } from '@/presentation/atoms';

import styles from './message-editor.module.scss';

export type EditFormType = {
  message: string;
};

type PropTypes = {
  form: UseFormReturn<EditFormType>;
  isDisabled: boolean;
  handleSendEvent: (message: string) => void;
};

const MessageEditor: React.FC<PropTypes> = ({ form, isDisabled, handleSendEvent }) => {
  const history = useWsHistory();

  useEffect(() => {
    if (!history.selected) return;
    form.setValue('message', history.selected.message);
    form.trigger('message');
  }, [history.selected]);

  return (
    <form
      className={styles.editor}
      onSubmit={form.handleSubmit(({ message }): void => handleSendEvent(message))}
    >
      <input
        className={clsx(styles.input, form.formState.errors.message && styles.error)}
        placeholder="Message"
        {...form.register('message', { required: true })}
        spellCheck="false"
      />
      <footer className={styles.footer}>
        <button className={styles.submit} type="submit" disabled={isDisabled}>
          Send
        </button>
      </footer>
    </form>
  );
};

export default MessageEditor;
