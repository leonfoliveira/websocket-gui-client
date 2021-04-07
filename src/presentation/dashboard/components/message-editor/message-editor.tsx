import clsx from 'clsx';
import React from 'react';
import { useForm } from 'react-hook-form';

import styles from './message-editor.module.scss';

type PropTypes = {
  isDisabled: boolean;
  handleSendEvent: (message: string) => void;
};

type FormType = {
  message: string;
};

const MessageEditor: React.FC<PropTypes> = ({ isDisabled, handleSendEvent }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>();

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
