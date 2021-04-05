import { WsSendEvent } from '@/data/usecases';
import { makeUuidAdapter } from '@/main/factories/infra';

export const makeWsSendEvent = (): WsSendEvent => new WsSendEvent(makeUuidAdapter());
