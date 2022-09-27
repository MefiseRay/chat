import Block from "../../utils/Block";
import template from "./searchUser.pug";
import {Input, InputTypes} from "../Input";
import {debounce} from "../../utils/Helpers";
import UsersController from "../../controllers/UsersController";
import {User} from "../../api/UsersAPI";
import * as searchUserStyles from "./searchUser.module.scss";
import {DropdownMenu, DropdownMenuItemsProps} from "../DropdownMenu";

export class SearchUser extends Block<{}> {

  protected init() {
    this._addSearchInput();
  }

  protected editPropsBeforeMakeThemProxy(props: Record<string, unknown>) {
    props.userList = [];
    props.styles = searchUserStyles;
  }

  protected render() {
    this._addUserList();
    return this.compile(template, this.props);
  }

  private _addSearchInput() {
    const debouncedSearch = debounce(async (login: string) => {
      this.props.userList = await UsersController.search(login);
    }, 1000);
    this.children.search = new Input({
      title: "Поиск пользователя",
      type: InputTypes.text,
      name: "user",
      value: "",
      placeholder: "Введите логин пользователя",
      isRounded: true,
      isLight: true,
      displayBlock: true,
      iconSrc: null
    });
    this.children.search.element!.addEventListener('keyup',  () => {
      debouncedSearch((this.children.search as Input).getValue());
    });
  }

  private _addUserList() {
    this.removeUserList();
    const items:DropdownMenuItemsProps[] = [];
    this.props.userList.forEach((user: User) => {
      items.push({
        text: `${user.login} - ${user.first_name} ${user.second_name}`,
        click: () => { console.log(user); },
      })
    });
    if(items.length > 0) {
      this.children.userList = new DropdownMenu({items});
      document.body.append(this.children.userList.getContent()!);
      this.children.userList.dispatchComponentDidMount();
      const target = this.getContent() as HTMLElement;
      const sourceElRect = target.getBoundingClientRect();
      const elRect = this.children.userList.element!.getBoundingClientRect();
      const horizontalShift = 10;
      const verticalShift = 10;
      let top = sourceElRect.bottom + verticalShift;
      let left = sourceElRect.left + horizontalShift;
      if (top + elRect.height > document.documentElement.clientHeight) {
        top = sourceElRect.top - elRect.height - verticalShift;
      }
      if (left + elRect.width > document.documentElement.clientWidth) {
        left = sourceElRect.left - elRect.width - horizontalShift;
      }
      this.children.userList.element!.style.top = `${top}px`;
      this.children.userList.element!.style.left = `${left}px`;
    }
  }

  private removeUserList() {
    if(this.children.userList) {
      const userList = this.children.userList as DropdownMenu;
      userList.element!.remove();
    }
  }
}