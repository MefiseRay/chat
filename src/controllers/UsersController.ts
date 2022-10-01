import API, {
  ChangePassword, UserChangeable, UsersAPI,
} from '../api/UsersAPI';

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

  async changAvatar(data: FormData) {
    try {
      await this.api.changeAvatar(data);
    } catch (e: any) {
      console.error(e.message);
    }
  }

  async search(login: string) {
    try {
      return await this.api.search(login);
    } catch (e: any) {
      console.error(e.message);
      return [];
    }
  }

  async getById(userId: string) {
    try {
      return await this.api.getById(userId);
    } catch (e: any) {
      console.error(e.message);
      return {};
    }
  }
}
export default new UsersController();
