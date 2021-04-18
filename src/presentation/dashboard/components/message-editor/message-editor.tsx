import clsx from 'clsx';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

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
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  return (
    <form
      className={styles.editor}
      onSubmit={handleSubmit(({ message }): void => handleSendEvent(message))}
    >
      <textarea
        className={clsx(styles.input, errors.message && styles.error)}
        placeholder="Message"
        {...register('message', { required: true })}
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
