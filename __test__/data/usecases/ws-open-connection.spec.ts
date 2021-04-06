import faker from 'faker';
import { MockProxy, mock } from 'jest-mock-extended';
import MockDate from 'mockdate';

import { KeyGenerator } from '@/data/interfaces';
import { WsClient, WsOpenConnection } from '@/data/usecases';

import { mockWebSocket } from '@/test/config/mock-websocket';

type SutTypes = {
  sut: WsOpenConnection;
  keyGeneratorSpy: MockProxy<KeyGenerator>;
};

const makeSut = (): SutTypes => {
  const keyGeneratorSpy = mock<KeyGenerator>();
  keyGeneratorSpy.generate.mockReturnValue(faker.datatype.uuid());
  const sut = new WsOpenConnection(keyGeneratorSpy);

  return { sut, keyGeneratorSpy };
};

describe('WsOpenConnection', () => {
  beforeAll(() => {
    mockWebSocket();
    MockDate.set(new Date());
  });

  afterAll(MockDate.reset);

  it('should create WebSocket client with correct url', () => {
    const { sut } = makeSut();
    const url = faker.internet.url();

    sut.open(url);

    expect(WsClient.getClient().url).toBe(url);
  });

  it('should create WebSocket client with correct listeners', () => {
    const { sut, keyGeneratorSpy } = makeSut();
    const listeners = {
      onopen: jest.fn(),
      onclose: jest.fn(),
      onevent: jest.fn(),
      onerror: jest.fn(),
    };
    const message: any = {
      lastEventId: faker.datatype.uuid(),
      data: faker.random.word(),
      timeStamp: faker.datatype.number(),
    };

    sut.open(faker.internet.url(), listeners);

    WsClient.getClient().onopen({} as any);
    expect(listeners.onopen).toHaveBeenCalledWith({
      key: keyGeneratorSpy.generate.mock.results[0].value,
      time: new Date(),
      type: 'connection-open',
    });
    WsClient.getClient().onclose({} as any);
    expect(listeners.onclose).toHaveBeenCalledWith({
      key: keyGeneratorSpy.generate.mock.results[0].value,
      time: new Date(),
      type: 'connection-close',
    });
    WsClient.getClient().onclose({} as any);
    expect(listeners.onclose).toHaveBeenCalledWith({
      key: keyGeneratorSpy.generate.mock.results[0].value,
      time: new Date(),
      type: 'connection-close',
    });
    WsClient.getClient().onmessage(message);
    expect(listeners.onevent).toHaveBeenCalledWith({
      key: keyGeneratorSpy.generate.mock.results[0].value,
      time: new Date(),
      type: 'server-event',
      message: message.data,
    });
    WsClient.getClient().onerror({} as any);
    expect(listeners.onerror).toHaveBeenCalledWith({
      key: keyGeneratorSpy.generate.mock.results[0].value,
      time: new Date(),
      type: 'error',
    });
  });
});
