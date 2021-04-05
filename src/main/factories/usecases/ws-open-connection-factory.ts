import { WsOpenConnection } from '@/data/usecases';
import { makeUuidAdapter } from '@/main/factories/infra';

export const makeWsOpenConnection = (): WsOpenConnection => new WsOpenConnection(makeUuidAdapter());
