import BaseAPI, {BaseCreateAPI, BaseDeleteAPI, BaseReadAPI} from "./BaseAPI";
import {ContentType} from "../utils/HTTPTransport";

export class ChatsAPI extends BaseAPI implements BaseReadAPI,BaseCreateAPI,BaseDeleteAPI{
  constructor() {
    super('/chats');
  }

  read(): Promise<unknown> {
    return this.http.get('/');
  }

  create(title: string): Promise<unknown> {
    return this.http.post('/', {title});
  }

  delete(chatId: string): Promise<unknown> {
    return this.http.delete('/', {chatId: chatId});
  }

  changeAvatar(chatId: string, data:FormData) {
    data.append("chatId", chatId)
    return this.http.put('/avatar', data, ContentType.FormData);
  }
}
export default new ChatsAPI();