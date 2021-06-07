import faker from 'faker';
import { MockProxy, mock } from 'jest-mock-extended';
import MockDate from 'mockdate';

import { KeyGenerator } from '@/application/interfaces';
import { ApiWsClient, ApiWsSendMessage } from '@/application/usecases';

import { mockWebSocket } from '@/test/config/mock-websocket';

type SutTypes = {
  sut: ApiWsSendMessage;
  keyGeneratorSpy: MockProxy<KeyGenerator>;
};

const makeSut = (): SutTypes => {
  const keyGeneratorSpy = mock<KeyGenerator>();
  keyGeneratorSpy.generate.mockReturnValue(faker.datatype.uuid());
  const sut = new ApiWsSendMessage(keyGeneratorSpy);

  return { sut, keyGeneratorSpy };
};

describe('ApiWsSendMessage', () => {
  beforeAll(() => {
    mockWebSocket();
    ApiWsClient.setClient(faker.internet.url());
    MockDate.set(new Date());
  });

  afterAll(MockDate.reset);

  it('should call WebSocket.send with correct value', () => {
    const { sut } = makeSut();
    const message = faker.random.word();

    sut.send(message);

    expect(ApiWsClient.getClient().send).toHaveBeenCalledWith(message);
  });

  it('should return an EventModel', () => {
    const { sut, keyGeneratorSpy } = makeSut();
    const message = faker.random.word();

    const result = sut.send(message);

    expect(result).toEqual({
      key: keyGeneratorSpy.generate.mock.results[0].value,
      time: new Date(),
      type: 'client-message',
      message,
    });
  });
});
