import Block from "../../../../utils/Block";
import * as chatProfileStyles from "./chatProfile.module.scss";
import template from "./chatProfile.pug";
import {withStore} from "../../../../utils/Store";
import {Avatar} from "../../../../components/Avatar";
import {Input, InputTypes} from "../../../../components/Input";
import {debounce} from "../../../../utils/Helpers";
import UsersController from "../../../../controllers/UsersController";
import ChatsController from "../../../../controllers/ChatsController";
import {User} from "../../../../api/UsersAPI";
import {UserLable, UserLableProps} from "../../../../components/UserLable";
import {Icon} from "../../../../components/Icon";
import deleteIcon from '../../../../../static/icon/close.svg';
import {SearchUser} from "../../../../components/SearchUser";

export class ChatProfileBase extends Block<{}> {

  constructor(props: {}) {
    super(props);
    this.element!.classList.add(chatProfileStyles.wrapper);
  }

  protected editPropsBeforeMakeThemProxy(props: Record<string, unknown>) {
    props.styles = chatProfileStyles;
  }

  protected render() {
    this._addChatImage();
    this._addUserList();
    this._searchUser();
    return this.compile(template, this.props);
  }

  private _addChatImage() {
    this.children.chatImage = new Avatar({
      src: this.props.chatList[this.props.openProfile].avatar,
      size: '8em',
      alt: this.props.chatList[this.props.openProfile].title,
      title: this.props.chatList[this.props.openProfile].title,
    });
  }

  private _addUserList() {
    this.children.users = [];
    const userList = this.props.chatList[this.props.openProfile].user_list;
    if(userList && userList.length > 0) {
      userList.forEach((user:User) => {
        const userLableProps:UserLableProps = {
          user
        };
        if(this.props.id !== user.id) {
          userLableProps.icon = new Icon({
            size: '1em',
            icon: deleteIcon,
          });
          userLableProps.callBack = async () => {
            await ChatsController.deleteUsers(this.props.openProfile, [user.id.toString()]);
          }
        }
        (this.children.users as UserLable[]).push(new UserLable(userLableProps));
      });
    }
  }

  private _searchUser() {
    this.children.searchUser = new SearchUser({
      callBack: async (userId) => {
        await ChatsController.addUsers(this.props.openProfile, [userId]);
        (this.children.searchUser as SearchUser).removeUserList();
      }
    });
  }
}

const withChatsAndUser = withStore((state) => ({...state.chats, ...state.user}));
export const ChatProfile = withChatsAndUser(ChatProfileBase);