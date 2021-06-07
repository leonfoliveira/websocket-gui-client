import faker from 'faker';

import { ApiWsClient, ApiWsCloseConnection } from '@/application/usecases';

import { mockWebSocket } from '@/test/config/mock-websocket';

const makeSut = (): ApiWsCloseConnection => new ApiWsCloseConnection();

describe('ApiWsCloseConnection', () => {
  beforeAll(() => {
    mockWebSocket();
    ApiWsClient.setClient(faker.internet.url());
  });

  it('should call WebSocket close', () => {
    const sut = makeSut();

    sut.close();

    expect(ApiWsClient.getClient().close).toHaveBeenCalled();
  });
});
