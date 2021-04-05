import { v4 as uuidv4 } from 'uuid';

import { KeyGenerator } from '@/data/interfaces';

export class UuidAdapter implements KeyGenerator {
  generate(): string {
    return uuidv4();
  }
}
