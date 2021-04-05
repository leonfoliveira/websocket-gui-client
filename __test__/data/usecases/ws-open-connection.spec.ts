import faker from 'faker';

import { WsClient, WsOpenConnection } from '@/data/usecases';

import { mockWebSocket } from '@/test/config/mock-websocket';

const makeSut = (): WsOpenConnection => new WsOpenConnection();

describe('WsOpenConnection', () => {
  beforeAll(mockWebSocket);

  it('should create WebSocket client with correct url', () => {
    const sut = makeSut();
    const url = faker.internet.url();

    sut.open(url);

    expect(WsClient.getClient().url).toBe(url);
  });

  it('should create WebSocket client with correct listeners', () => {
    const sut = makeSut();
    const options = {
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

    sut.open(faker.internet.url(), options);

    expect(WsClient.getClient().onopen).toBe(options.onopen);
    expect(WsClient.getClient().onclose).toBe(options.onclose);
    expect(WsClient.getClient().onmessage).toBeTruthy();
    WsClient.getClient().onmessage(message);
    expect(options.onevent).toHaveBeenCalledWith({
      key: message.lastEventId,
      message: message.data,
      time: new Date(message.timeStamp * 1000),
    });
    expect(WsClient.getClient().onerror).toBe(options.onerror);
  });
});
