import API, {ChangePassword, UserChangeable, UsersAPI} from "../api/UsersAPI";
import store from '../utils/Store';
import router from '../utils/Router';

export class UsersController {
  private readonly api: UsersAPI;

  constructor() {
    this.api = API;
  }

  async updateProfile(data:UserChangeable) {
    try {
      await this.api.update(data);
    } catch (e: any) {
      console.error(e.message);
    }
  }

  async changePassword(data:ChangePassword) {
    try {
      await this.api.changePassword(data);
    } catch (e: any) {
      console.error(e.message);
    }
  }
}
export default new UsersController();