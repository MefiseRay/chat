import {EventBus} from "./EventBus";
import {getMessageTime, isPlainObject} from "./Helpers";
import store from "./Store";
import API from '../api/ResourcesAPI';

enum MessageType {
  MESSAGE= 'message',
  FILE= 'file'
}

export interface SocketData {
  socketUserId: string,
  socketChatId: string,
  socketToken: string
}

export class ChatWebSocket {
  static EVENTS = {
    OPEN: 'open',
    CLOSE: 'close',
    MESSAGE: 'message',
    ERROR: 'error',
  };

  static WEB_SOCKET_URL = "wss://ya-praktikum.tech/ws/chats";
  protected endpoint: string;
  protected socket: WebSocket;
  protected eventBus: () => EventBus;

  constructor(userId:string, chatId:string, token:string) {
    const eventBus = new EventBus();
    this.eventBus = () => eventBus;
    this.endpoint = `${ChatWebSocket.WEB_SOCKET_URL}/${userId}/${chatId}/${token}`;
    this.socket = new WebSocket(this.endpoint);
    this._addSocketEventListeners();
    this._registerEvents(eventBus);
  }

  private _registerEvents(eventBus: EventBus): void {
    eventBus.on(ChatWebSocket.EVENTS.OPEN, this._open.bind(this));
    eventBus.on(ChatWebSocket.EVENTS.CLOSE, this._close.bind(this));
    eventBus.on(ChatWebSocket.EVENTS.MESSAGE, this._message.bind(this));
    eventBus.on(ChatWebSocket.EVENTS.ERROR, this._error.bind(this));
  }

  private _open() {
    console.log('Соединение установлено');
    this._autoPing();
    this.getMessages();
    this.getPing();
  }

  private _message(data: unknown) {
    if(Array.isArray(data)) {
      data = data.map((message) => {
        if(message.time) {
          message.time = getMessageTime(new Date(message.time), true);
        }
        return message;
      });
      console.log(data);
      store.set('messages', {list: data}, true);
    } else if (isPlainObject(data) && data.type && data.type === 'message') {
      this.getMessages();
    }
  }

  private _error() {}

  private _close() {}

  private _addSocketEventListeners() {
    this.socket.addEventListener('open', () => {
      this.eventBus().emit(ChatWebSocket.EVENTS.OPEN);
    });

    this.socket.addEventListener('close', event => {
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения');
      }
      console.log(`Код: ${event.code} | Причина: ${event.reason}`);
      this.eventBus().emit(ChatWebSocket.EVENTS.CLOSE);
    });

    this.socket.addEventListener('message', event => {
      this.eventBus().emit(ChatWebSocket.EVENTS.MESSAGE, JSON.parse(event.data));
    });

    this.socket.addEventListener('error', event => {
      console.log('Ошибка', event);
      this.eventBus().emit(ChatWebSocket.EVENTS.ERROR);
    });
  }

  public sendMessage(content:string, type:MessageType = MessageType.MESSAGE) {
    this.socket.send(JSON.stringify({
      content,
      type: 'message',
    }));
  }

  public async sendFile(data: FormData) {
    await API.sendFile(data).then((fileId) => {
      this.sendMessage(fileId.id, MessageType.FILE);
    })
  }

  public getMessages(start: string = "0") {
    this.socket.send(JSON.stringify({
      content: start,
      type: 'get old',
    }));
  }

  public close() {
    this.socket.close();
  }

  public getPing() {
    this.socket.send(JSON.stringify({
      content: "",
      type: 'ping',
    }));
  }

  private _autoPing() {
    console.log("Пинг соединения");
    this.getPing()
    setTimeout(() => this._autoPing(), 10000);
  }
}