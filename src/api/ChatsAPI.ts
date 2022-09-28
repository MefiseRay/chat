import BaseAPI, {BaseCreateAPI, BaseDeleteAPI, BaseReadAPI} from "./BaseAPI";
import {ContentType} from "../utils/HTTPTransport";
import {User, UserChangeable} from "./UsersAPI";

export interface ChatData {
  id: number,
  title: string,
  avatar?: string,
  unread_count: number,
  last_message?: {
    user: UserChangeable,
    time: string,
    content: string
  },
  user_list?: User[]
}
export interface ChatsData {
  chatList?:Record<string, ChatData>,
  selected?:string,
  openProfile?:string
}

export class ChatsAPI extends BaseAPI implements BaseReadAPI,BaseCreateAPI,BaseDeleteAPI{
  constructor() {
    super('/chats');
  }

  read(): Promise<ChatData[]> {
    return this.http.get('/');
  }

  create(title: string): Promise<{id:string}> {
    return this.http.post('/', {title});
  }

  delete(chatId: string): Promise<unknown> {
    return this.http.delete('/', {chatId: chatId});
  }

  changeAvatar(chatId: string, data:FormData): Promise<ChatData> {
    data.append("chatId", chatId)
    return this.http.put('/avatar', data, ContentType.FormData);
  }

  getToken(chatId: number): Promise<{ token: string }> {
    return this.http.post(`/token/${chatId}`);
  }

  getUserList(chatId: string): Promise<User[]> {
    return this.http.get(`/${chatId}/users`);
  }
}
export default new ChatsAPI();