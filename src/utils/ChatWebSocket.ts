import {EventBus} from "./EventBus";
import {isPlainObject} from "./Helpers";
import store from "./Store";
import {ChatMessagesList, MessageData} from "../modules/Chat/components/ChatMessages";

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
    this.getMessages();
    this.getPing();
  }

  private _message(data: unknown) {
    console.log('Получены данные', data);
    if(Array.isArray(data)) {
      store.set('messages.list', data, true);
    } else if (isPlainObject(data) && data.type && data.type === 'message') {
      let messagesList;
      if(store.getState().messages && !Array.isArray((store.getState().messages as ChatMessagesList).list)) {
        messagesList = (store.getState().messages as ChatMessagesList).list as MessageData[];
      } else {
        messagesList = [];
      }
      messagesList.unshift(data);
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

  public sendMessage(content:string) {
    this.socket.send(JSON.stringify({
      content,
      type: 'message',
    }));
  }

  public getMessages(start: string = "0") {
    this.socket.send(JSON.stringify({
      content: start,
      type: 'get old',
    }));
  }

  public getPing() {
    this.socket.send(JSON.stringify({
      content: "",
      type: 'ping',
    }));
  }
}