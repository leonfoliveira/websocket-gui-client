export class ApiWsClient {
  private static instance: WebSocket = null;

  /* istanbul ignore next */
  private constructor() {}

  public static getClient(): WebSocket {
    return ApiWsClient.instance;
  }

  public static setClient(url: string): void {
    ApiWsClient.instance = new WebSocket(url);
  }
}
