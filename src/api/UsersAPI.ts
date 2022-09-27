import BaseAPI, {BaseReadAPI, BaseUpdateAPI} from "./BaseAPI";
import {ContentType} from "../utils/HTTPTransport";

export interface UserChangeable {
  first_name: string;
  second_name: string;
  display_name?: string;
  login: string;
  email: string;
  phone: string;
}

export interface User extends UserChangeable{
  id: number;
  avatar: string;
}

export interface ChangePassword {
  oldPassword:string,
  newPassword:string
}
export interface ChangePasswordForm extends ChangePassword {
  newPasswordConfirmation:string
}

export class UsersAPI extends BaseAPI implements BaseReadAPI {
  constructor() {
    super('/user');
  }

  read(): Promise<User> {
    return this.http.get('/');
  }

  update(data:UserChangeable):Promise<User> {
    return this.http.put('/profile', data);
  }

  changePassword(data:ChangePassword) {
    return this.http.put('/password', data);
  }

  changeAvatar(data:FormData) {
    return this.http.put('/profile/avatar', data, ContentType.FormData);
  }

  search(login: string) {
    return this.http.post('/search', {login});
  }

}
export default new UsersAPI();