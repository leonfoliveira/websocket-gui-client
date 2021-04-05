import faker from 'faker';
import uuid from 'uuid';

import { UuidAdapter } from '@/infra';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const makeSut = (): UuidAdapter => new UuidAdapter();

describe('UuidAdapter', () => {
  it('should return the same as uuidv4', () => {
    const id = faker.datatype.uuid();
    jest.spyOn(uuid, 'v4').mockReturnValue(id);
    const sut = makeSut();

    const result = sut.generate();

    expect(result).toBe(id);
  });
});
