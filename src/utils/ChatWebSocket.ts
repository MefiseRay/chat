export class ChatWebSocket {
  static WEB_SOCKET_URL = "wss://ya-praktikum.tech/ws/chats";
  protected endpoint: string;
  protected socket: WebSocket;

  constructor(userId:string, chatId:string, token:string) {
    this.endpoint = `${ChatWebSocket.WEB_SOCKET_URL}/${userId}/${chatId}/${token}`;
    this.socket = new WebSocket(this.endpoint);
    this._addSocketEventListeners();
  }

  private _addSocketEventListeners() {
    this.socket.addEventListener('open', () => {
      console.log('Соединение установлено');
    });

    this.socket.addEventListener('close', event => {
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения');
      }
      console.log(`Код: ${event.code} | Причина: ${event.reason}`);
    });

    this.socket.addEventListener('message', event => {
      console.log('Получены данные', event.data);
    });

    this.socket.addEventListener('error', event => {
      console.log('Ошибка', event);
    });
  }

  public sendMessage(content:string) {
    this.socket.send(JSON.stringify({
      content,
      type: 'message',
    }));
  }

  public getMessages(start: string = "0") {
    this.socket.send(JSON.stringify({
      content: start,
      type: 'get_old',
    }));
  }
}