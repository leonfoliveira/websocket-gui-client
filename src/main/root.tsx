import React from 'react';

import '@/presentation/styles/global.scss';
import {
  makeWsCloseConnection,
  makeWsOpenConnection,
  makeWsSendEvent,
} from '@/main/factories/usecases';
import { UsecasesContext } from '@/presentation/contexts';
import Dashboard from '@/presentation/dashboard/dashboard';

const Root: React.FC = () => (
  <UsecasesContext.Provider
    value={{
      closeConnection: makeWsCloseConnection(),
      openConnection: makeWsOpenConnection(),
      sendEvent: makeWsSendEvent(),
    }}
  >
    <Dashboard />
  </UsecasesContext.Provider>
);

export default Root;
