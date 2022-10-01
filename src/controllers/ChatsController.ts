import API, { ChatData, ChatsAPI } from '../api/ChatsAPI';
import store from '../utils/Store';
import { ChatWebSocket } from '../utils/ChatWebSocket';
import { getMessageTime } from '../utils/Helpers';

export class ChatsController {
  private readonly api: ChatsAPI;

  private webSocket:ChatWebSocket | null = null;

  constructor() {
    this.api = API;
  }

  async get(rewrite = false) {
    try {
      const chatList = await this.api.read();
      const chats: Record<string, ChatData> = {};
      for (const chat of chatList) {
        chat.user_list = await this.api.getUserList(chat.id.toString());
        if (chat.last_message && chat.last_message.time) {
          chat.last_message.time = getMessageTime(new Date(chat.last_message.time));
        }
        chats[chat.id] = chat;
      }
      store.set('chats.chatList', chats, rewrite);
    } catch (e: any) {
      console.error(e);
    }
  }

  async create(title:string) {
    try {
      const chat = await this.api.create(title);
      await this.get();
      await this.select(chat.id);
      return chat.id;
    } catch (e: any) {
      console.error(e);
      return null;
    }
  }

  async changAvatar(chatId:string, data: FormData) {
    try {
      await this.api.changeAvatar(chatId, data).then(async () => {
        await this.get(true);
        await this.openProfile(chatId);
      });
    } catch (e: any) {
      console.error(e.message);
    }
  }

  async getToken(chatId: string) {
    try {
      const token = await this.api.getToken(chatId);
      return token.token;
    } catch (e: any) {
      console.error(e.message);
      return null;
    }
  }

  async getSocket(chatId: string) {
    try {
      if (store.getState().user !== undefined) {
        const userId = store.getState().user?.id;
        const token = await this.getToken(chatId);
        if (userId && chatId && token) {
          this.webSocket = new ChatWebSocket(userId.toString(), chatId, token);
        }
      }
    } catch (e: any) {
      console.error(e.message);
    }
  }

  async addUsers(chatId: string, users: string[]) {
    try {
      await this.api.addUsers(chatId, users);
      await this.get(true);
      await this.openProfile(chatId);
    } catch (e: any) {
      console.error(e.message);
    }
  }

  async deleteUsers(chatId: string, users: string[]) {
    try {
      await this.api.deleteUsers(chatId, users);
      await this.get(true);
      await this.openProfile(chatId);
    } catch (e: any) {
      console.error(e.message);
    }
  }

  async select(chatId: string) {
    this.closeProfile();
    await this.getSocket(chatId).then(() => {
      store.set('chats.selected', chatId);
    });
  }

  unselectAll() {
    this.closeProfile();
    store.set('socket', null);
    store.set('chats.selected', null);
  }

  delete(chatId:string) {
    try {
      this.api.delete(chatId).then(
        async () => {
          this.unselectAll();
          await this.get(true);
        },
      );
    } catch (e: any) {
      console.error(e);
    }
  }

  openProfile(chatId:string) {
    store.set('chats.openProfile', chatId);
  }

  closeProfile() {
    store.set('chats.openProfile', null);
  }

  getChatWebSocket() {
    return this.webSocket;
  }
}

export default new ChatsController();
