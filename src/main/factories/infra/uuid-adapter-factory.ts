import { UuidAdapter } from '@/infra';

export const makeUuidAdapter = (): UuidAdapter => new UuidAdapter();
