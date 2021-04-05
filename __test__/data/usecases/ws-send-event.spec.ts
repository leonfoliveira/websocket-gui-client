import faker from 'faker';
import { MockProxy, mock } from 'jest-mock-extended';
import MockDate from 'mockdate';

import { KeyGenerator } from '@/data/interfaces';
import { WsClient, WsSendEvent } from '@/data/usecases';

import { mockWebSocket } from '@/test/config/mock-websocket';

type SutTypes = {
  sut: WsSendEvent;
  keyGeneratorSpy: MockProxy<KeyGenerator>;
};

const makeSut = (): SutTypes => {
  const keyGeneratorSpy = mock<KeyGenerator>();
  keyGeneratorSpy.generate.mockReturnValue(faker.datatype.uuid());
  const sut = new WsSendEvent(keyGeneratorSpy);

  return { sut, keyGeneratorSpy };
};

describe('SendEvent', () => {
  beforeAll(() => {
    mockWebSocket();
    WsClient.setClient(faker.internet.url());
    MockDate.set(new Date());
  });

  afterAll(MockDate.reset);

  it('should call WebSocket.send with correct value', () => {
    const { sut } = makeSut();
    const message = faker.random.word();

    sut.send(message);

    expect(WsClient.getClient().send).toHaveBeenCalledWith(message);
  });

  it('should return an EventModel', () => {
    const { sut, keyGeneratorSpy } = makeSut();
    const message = faker.random.word();

    const result = sut.send(message);

    expect(result).toEqual({
      key: keyGeneratorSpy.generate.mock.results[0].value,
      time: new Date(),
      message,
    });
  });
});
