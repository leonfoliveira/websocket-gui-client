import { createContext, useContext } from 'react';

import { CloseConnection, OpenConnection, SendEvent } from '@/domain/usecases';

type UsecasesContextType = {
  closeConnection: CloseConnection;
  openConnection: OpenConnection;
  sendEvent: SendEvent;
};

export const UsecasesContext = createContext<UsecasesContextType>({
  closeConnection: null,
  openConnection: null,
  sendEvent: null,
});

export const useUsecase = (): UsecasesContextType => useContext(UsecasesContext);
