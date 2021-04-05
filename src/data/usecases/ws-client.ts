export class WsClient {
  private static instance: WebSocket = null;

  /* istanbul ignore next */
  private constructor() {}

  public static getClient(): WebSocket {
    return WsClient.instance;
  }

  public static setClient(url: string): void {
    WsClient.instance = new WebSocket(url);
  }
}
