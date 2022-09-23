import API, {ChatsAPI} from "../api/ChatsAPI";

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
      await this.api.create(title);
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