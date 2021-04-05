import { WsCloseConnection } from '@/data/usecases';

export const makeWsCloseConnection = (): WsCloseConnection => new WsCloseConnection();
