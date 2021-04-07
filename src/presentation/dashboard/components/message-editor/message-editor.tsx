import React from 'react';

import styles from './message-editor.module.scss';

const MessageEditor: React.FC = () => (
  <form className={styles.editor}>
    <textarea className={styles.input} placeholder="Message" />
    <footer className={styles.footer}>
      <button className={styles.submit} type="submit">
        Send
      </button>
    </footer>
  </form>
);

export default MessageEditor;
