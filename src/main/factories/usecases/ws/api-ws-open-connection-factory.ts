import { ApiWsOpenConnection } from '@/application/usecases';
import { makeUuidAdapter } from '@/main/factories/infra';

export const makeApiWsOpenConnection = (): ApiWsOpenConnection =>
  new ApiWsOpenConnection(makeUuidAdapter());
