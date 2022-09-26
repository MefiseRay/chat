import API, {ChatData, ChatsAPI} from "../api/ChatsAPI";
import store from "../utils/Store";

export class ChatsController {

  private readonly api: ChatsAPI;

  constructor() {
    this.api = API;
  }

  async get() {
    try {
      const chatList = await this.api.read();
      let chats: Record<string, ChatData> = {};
      for (const chat of chatList) {
        chats[chat.id] = chat;
      }
      store.set('chats.chatList', chats);
    } catch (e: any) {
      console.error(e);
    }
  }

  async create(title:string) {
    try {
      const chat = await this.api.create(title);
      return chat.id;
    } catch (e: any) {
      console.error(e);
    }
  }

  async delete(chatId:string) {
    try {
      await this.api.delete(chatId);
      await this.get();
    } catch (e: any) {
      console.error(e);
    }
  }

  async changAvatar(chatId:string, data: FormData) {
    try {
      await this.api.changeAvatar(chatId, data);
    } catch (e: any) {
      console.error(e.message);
    }
  }

  async getToken(chatId: number) {
    try {
      const token = await this.api.getToken(chatId);
      return token.token;
    } catch (e: any) {
      console.error(e.message);
    }
  }

  async getSocket(chatId: number) {
    try {
      if(store.getState().user !== undefined) {
        const userId = store.getState().user?.id;
        const token = await this.api.getToken(chatId);
        store.set('socket', {
          socketUserId: userId,
          socketChatId: chatId,
          socketToken: token.token
        });
      }
    } catch (e: any) {
      console.error(e.message);
    }
  }
}

export default new ChatsController();