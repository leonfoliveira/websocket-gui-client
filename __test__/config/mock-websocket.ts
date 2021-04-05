class WebSocketSpy {
  onopen = null;
  onclose = null;
  onmessage = null;
  onerror = null;

  constructor(public url: string) {}
}

export const mockWebSocket = (): void => {
  global.WebSocket = WebSocketSpy as any;
};
