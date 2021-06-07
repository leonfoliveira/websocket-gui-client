import { createContext, useContext } from 'react';

import { WsCloseConnection, WsOpenConnection, WsSendMessage } from '@/domain/usecases';

type UsecasesContextType = {
  wsCloseConnection: WsCloseConnection;
  wsOpenConnection: WsOpenConnection;
  wsSendMessage: WsSendMessage;
};

export const UsecasesContext = createContext<UsecasesContextType>({
  wsCloseConnection: null,
  wsOpenConnection: null,
  wsSendMessage: null,
});

export const useUsecase = (): UsecasesContextType => useContext(UsecasesContext);
