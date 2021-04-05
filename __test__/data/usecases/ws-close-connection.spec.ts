import faker from 'faker';

import { WsClient, WsCloseConnection } from '@/data/usecases';

import { mockWebSocket } from '@/test/config/mock-websocket';

const makeSut = (): WsCloseConnection => new WsCloseConnection();

describe('WsCloseConnection', () => {
  beforeAll(() => {
    mockWebSocket();
    WsClient.setClient(faker.internet.url());
  });

  it('should call WebSocket close', () => {
    const sut = makeSut();

    sut.close();

    expect(WsClient.getClient().close).toHaveBeenCalled();
  });
});
