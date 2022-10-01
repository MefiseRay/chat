import BaseAPI, { BaseReadAPI } from './BaseAPI';
import { User } from './UsersAPI';

export interface SignInData {
  login: string;
  password: string;
}

export interface SignUpData {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

export class AuthAPI extends BaseAPI implements BaseReadAPI {
  constructor() {
    super('/auth');
  }

  signIn(data: SignInData) {
    return this.http.post('/signin', data);
  }

  signUp(data: SignUpData) {
    return this.http.post('/signup', data);
  }

  read(): Promise<User> {
    return this.http.get('/user');
  }

  logout() {
    return this.http.post('/logout');
  }
}
export default new AuthAPI();
