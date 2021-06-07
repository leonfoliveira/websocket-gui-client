import React from 'react';

import { ConnectionHeader, MessageEditor, LiveView, HistoryView } from './components';
import styles from './dashboard.module.scss';

const Dashboard: React.FC = () => (
  <main className={styles.dashboard}>
    <ConnectionHeader />
    <div className={styles.content}>
      <div className={styles.sider}>
        <HistoryView />
        <MessageEditor />
      </div>
      <div className={styles.sider}>
        <LiveView />
      </div>
    </div>
  </main>
);

export default Dashboard;
