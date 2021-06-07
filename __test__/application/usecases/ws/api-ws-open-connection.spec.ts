import faker from 'faker';
import { MockProxy, mock } from 'jest-mock-extended';
import MockDate from 'mockdate';

import { KeyGenerator } from '@/application/interfaces';
import { ApiWsClient, ApiWsOpenConnection } from '@/application/usecases';

import { mockWebSocket } from '@/test/config/mock-websocket';

type SutTypes = {
  sut: ApiWsOpenConnection;
  keyGeneratorSpy: MockProxy<KeyGenerator>;
};

const makeSut = (): SutTypes => {
  const keyGeneratorSpy = mock<KeyGenerator>();
  keyGeneratorSpy.generate.mockReturnValue(faker.datatype.uuid());
  const sut = new ApiWsOpenConnection(keyGeneratorSpy);

  return { sut, keyGeneratorSpy };
};

describe('ApiWsOpenConnection', () => {
  beforeAll(() => {
    mockWebSocket();
    MockDate.set(new Date());
  });

  afterAll(MockDate.reset);

  it('should create WebSocket client with correct url', () => {
    const { sut } = makeSut();
    const url = faker.internet.url();

    sut.open(url);

    expect(ApiWsClient.getClient().url).toBe(url);
  });

  it('should create WebSocket client with correct listeners', () => {
    const { sut, keyGeneratorSpy } = makeSut();
    const listeners = {
      onConnection: jest.fn(),
      onDisconnection: jest.fn(),
      onMessage: jest.fn(),
      onError: jest.fn(),
    };
    const message: any = {
      lastEventId: faker.datatype.uuid(),
      data: faker.random.word(),
      timeStamp: faker.datatype.number(),
    };

    sut.open(faker.internet.url(), listeners);

    ApiWsClient.getClient().onopen({} as any);
    expect(listeners.onConnection).toHaveBeenCalledWith({
      key: keyGeneratorSpy.generate.mock.results[0].value,
      time: new Date(),
      type: 'connection',
    });
    ApiWsClient.getClient().onclose({} as any);
    expect(listeners.onDisconnection).toHaveBeenCalledWith({
      key: keyGeneratorSpy.generate.mock.results[0].value,
      time: new Date(),
      type: 'disconnection',
    });
    ApiWsClient.getClient().onclose({} as any);
    expect(listeners.onDisconnection).toHaveBeenCalledWith({
      key: keyGeneratorSpy.generate.mock.results[0].value,
      time: new Date(),
      type: 'disconnection',
    });
    ApiWsClient.getClient().onmessage(message);
    expect(listeners.onMessage).toHaveBeenCalledWith({
      key: keyGeneratorSpy.generate.mock.results[0].value,
      time: new Date(),
      type: 'server-message',
      message: message.data,
    });
    ApiWsClient.getClient().onerror({} as any);
    expect(listeners.onError).toHaveBeenCalledWith({
      key: keyGeneratorSpy.generate.mock.results[0].value,
      time: new Date(),
      type: 'error',
    });
  });
});
