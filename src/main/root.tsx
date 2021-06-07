import React from 'react';
import { RecoilRoot } from 'recoil';

import '@/presentation/styles/global.scss';

import {
  makeApiWsCloseConnection,
  makeApiWsOpenConnection,
  makeApiWsSendMessage,
} from '@/main/factories/usecases';
import { UsecasesContext } from '@/presentation/contexts';
import Dashboard from '@/presentation/dashboard/dashboard';

const Root: React.FC = () => (
  <RecoilRoot>
    <UsecasesContext.Provider
      value={{
        wsCloseConnection: makeApiWsCloseConnection(),
        wsOpenConnection: makeApiWsOpenConnection(),
        wsSendMessage: makeApiWsSendMessage(),
      }}
    >
      <Dashboard />
    </UsecasesContext.Provider>
  </RecoilRoot>
);

export default Root;
