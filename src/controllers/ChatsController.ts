import API, {ChatsAPI} from "../api/ChatsAPI";
import store from "../utils/Store";

export class ChatsController {

  private readonly api: ChatsAPI;

  constructor() {
    this.api = API;
  }

  async get() {
    try {
      await this.api.read();
    } catch (e: any) {
      console.error(e);
    }
  }

  async create(title:string) {
    try {
      const chat = await this.api.create(title);
      if(chat.id) store.set('selectedChat', chat.id);
    } catch (e: any) {
      console.error(e);
    }
  }

  async delete(chatId:string) {
    try {
      await this.api.delete(chatId);
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