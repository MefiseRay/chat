import API, {ChatData, ChatsAPI} from "../api/ChatsAPI";
import store from "../utils/Store";

export class ChatsController {

  private readonly api: ChatsAPI;

  constructor() {
    this.api = API;
  }

  async get(rewrite= false) {
    try {
      const chatList = await this.api.read();
      let chats: Record<string, ChatData> = {};
      for (const chat of chatList) {
        chat.user_list = await this.api.getUserList(chat.id.toString());
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
      this.select(chat.id);
      return chat.id;
    } catch (e: any) {
      console.error(e);
    }
  }

  async changAvatar(chatId:string, data: FormData) {
    try {
      await this.api.changeAvatar(chatId, data);
      await this.get();
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

  async addUsers(chatId: string, users: string[]) {
    try {
      await this.api.addUsers(chatId, users);
      await this.get();
    } catch (e: any) {
      console.error(e.message);
    }
  }

  async deleteUsers(chatId: string, users: string[]) {
    try {
      await this.api.deleteUsers(chatId, users);
      await this.get();
    } catch (e: any) {
      console.error(e.message);
    }
  }

  delete(chatId:string) {
    try {
      this.api.delete(chatId).then(
        async () => {
          this.unselectAll();
          await this.get(true);
        }
      );
    } catch (e: any) {
      console.error(e);
    }
  }

  select(chatId:string) {
    this.closeProfile();
    store.set('chats.selected', chatId);
  }

  openProfile(chatId:string) {
    store.set('chats.openProfile', chatId);
  }

  closeProfile() {
    store.set('chats.openProfile', null);
  }

  unselectAll() {
    this.closeProfile();
    store.set('chats.selected', null);
  }
}

export default new ChatsController();