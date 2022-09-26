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
      chatList.forEach((chat) => {
        chats[chat.id] = chat;
      })
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

}

export default new ChatsController();