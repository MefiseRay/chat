import Block from "../../../../utils/Block";
import * as chatProfileStyles from "./chatProfile.module.scss";
import template from "./chatProfile.pug";
import {withStore} from "../../../../utils/Store";
import {Avatar} from "../../../../components/Avatar";
import {Input, InputTypes} from "../../../../components/Input";
import {closeDropdown, debounce, makeDropdown} from "../../../../utils/Helpers";
import UsersController from "../../../../controllers/UsersController";
import ChatsController from "../../../../controllers/ChatsController";
import {User, UserChangeable} from "../../../../api/UsersAPI";
import {UserLable, UserLableProps} from "../../../../components/UserLable";
import {Icon} from "../../../../components/Icon";
import deleteIcon from '../../../../../static/icon/close.svg';
import {SearchUser} from "../../../../components/SearchUser";
import {Form} from "../../../Form";
import {Button} from "../../../../components/Button";
import {Dropdown} from "../../../../components/Dropdown";

export class ChatProfileBase extends Block<{}> {

  constructor(props: {}) {
    super(props);
    this.element!.classList.add(chatProfileStyles.wrapper);
  }

  protected editPropsBeforeMakeThemProxy(props: Record<string, unknown>) {
    props.styles = chatProfileStyles;
  }

  protected init() {
    this._addBackButton();
    this._searchUser();
    this._addChatForm();
  }

  protected render() {
    this._addChatImage();
    this._addUserList();
    return this.compile(template, this.props);
  }

  private _addChatImage() {
    this.children.chatImage = new Avatar({
      src: this.props.chatList[this.props.openProfile].avatar,
      size: '8em',
      alt: this.props.chatList[this.props.openProfile].title,
      title: this.props.chatList[this.props.openProfile].title,
    });

    (this.children.chatImage as Avatar).element!.addEventListener('click', (event: MouseEvent) => {
      makeDropdown(this.children.dropdownForm as Form<Record<string, unknown>>, event.target as HTMLElement);
    });
    (this.children.chatImage as Avatar).element!.style.cursor = 'pointer';
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

  private _addChatForm() {
    this.children.addForm = new Form({
      action: "",
      method: "",
      title: "",
      inputs: [
        new Input({
          title: 'Аватар',
          type: InputTypes.file,
          name: 'avatar',
          value: this.props.login,
          placeholder: 'Аватар',
          isRounded: false,
          isLight: false,
          displayBlock: true,
          iconSrc: null,
        }),
      ],
      buttons: [
        new Button({
          text: 'Изменить аватар',
          events: {
            click: async (event) => {
              event.stopPropagation();
              event.preventDefault();
              const formData = (this.children.addForm as Form<UserChangeable>).getFormData();
              closeDropdown(this.children.dropdownForm as Form<UserChangeable>);
              if(formData) {
                if ((formData.get("avatar") as File).name !== "") {
                  await ChatsController.changAvatar(this.props.openProfile, formData);
                }
              }
            },
          },
          isTransparent: false,
          isBordered: false,
          isWhite: false,
          displayBlock: true,
        }),
      ],
      compact: true
    })
    this.children.dropdownForm = new Dropdown({
      items: [this.children.addForm]
    });
  }

  private _addBackButton() {
    this.children.backButton = new Button({
      text: 'Назад к чату',
      events: {
        click: async (event) => {
          event.stopPropagation();
          event.preventDefault();
          await ChatsController.select(this.props.openProfile);
        },
      },
      isTransparent: false,
      isBordered: false,
      isWhite: false,
      displayBlock: true,
    })
  }
}

const withChatsAndUser = withStore((state) => ({...state.chats, ...state.user}));
export const ChatProfile = withChatsAndUser(ChatProfileBase);