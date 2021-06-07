import { ApiWsSendMessage } from '@/application/usecases';
import { makeUuidAdapter } from '@/main/factories/infra';

export const makeApiWsSendMessage = (): ApiWsSendMessage => new ApiWsSendMessage(makeUuidAdapter());
