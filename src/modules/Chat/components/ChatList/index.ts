import Block from '../../../../utils/Block';
import template from './chatList.pug';
import * as chatListStyles from './chatList.module.scss';
import {Icon, IconProps} from '../../../../components/Icon';
import {Input, InputTypes} from '../../../../components/Input';
import {ChatItem} from '../ChatItem';
import {ChatUser, ChatUserBase} from '../ChatUser';
import Router from "../../../../utils/Router";
import {Routes} from "../../../../index";
import ChatsController from "../../../../controllers/ChatsController";
import store, {withStore} from "../../../../utils/Store";
import {ChatData, ChatsData} from "../../../../api/ChatsAPI";
import {Form} from "../../../Form";
import {Button} from "../../../../components/Button";
import ValidationHelper from "../../../../utils/ValidationHelper";
import {UserChangeable} from "../../../../api/UsersAPI";
import {closeDropdown, makeDropdown} from "../../../../utils/Helpers";
import {DropdownMenu} from "../../../../components/DropdownMenu";
import {Dropdown} from "../../../../components/Dropdown";

export interface ChatListProps {
  addChatIconSrc: string,
  searchIconSrc: string,
  selected?: string,
  styles?: Record<string, unknown>
}

export class ChatListBase extends Block<ChatListProps> {
  constructor(props: ChatListProps) {
    super(props);
    this.element!.classList.add(chatListStyles.wrapper);
  }

  protected editPropsBeforeMakeThemProxy(props: ChatListProps) {
    props.styles = chatListStyles;
  }

  protected render() {
    this._addItemsList();
    this._addButton();
    this._addSearchInput();
    this._addChatUser();
    return this.compile(template, this.props);
  }

  private _addChatUser() {
    this.children.chatUser = new ChatUser({
      events: {
        click: () => {
          Router.go(Routes.Profile);
        },
      },
    });
  }

  private _addButton() {
    this.children.addButton = new Icon({
      size: '1.5em',
      icon: this.props.addChatIconSrc,
    });
    this._addChatForm();

    (this.children.addButton as Icon).element!.addEventListener('click', (event: MouseEvent) => {
      makeDropdown(this.children.dropdownForm as Form<Record<string, unknown>>, event.target as HTMLElement);
    });
  }

  private _addChatForm() {
    this.children.addForm = new Form({
      action: "",
      method: "",
      title: "",
      inputs: [
        new Input({
          title: 'Название чата',
          type: InputTypes.text,
          name: 'name',
          value: this.props.login,
          placeholder: 'Название чата',
          isRounded: true,
          isLight: true,
          displayBlock: true,
          iconSrc: null,
        }),
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
          text: 'Создать',
          events: {
            click: async (event) => {
              event.stopPropagation();
              event.preventDefault();
              const formData = (this.children.addForm as Form<UserChangeable>).getFormData();
              closeDropdown(this.children.dropdownForm as Form<UserChangeable>);
              if(formData) {
                const name = formData.get("name");
                if(name) {
                  const chatId = await ChatsController.create(name.toString()).then(async (chatId) => {
                    if (chatId && (formData.get("avatar") as File).name !== "") {
                      await ChatsController.changAvatar(chatId, formData);
                    }
                  });
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

  private _addSearchInput() {
    this.children.searchInput = new Input({
      title: 'Поиск',
      type: InputTypes.text,
      name: 'search',
      value: '',
      placeholder: 'Поиск',
      isRounded: true,
      isLight: true,
      displayBlock: true,
      iconSrc: this.props.searchIconSrc,
    });
  }

  private _addItemsList() {
    const itemsList = [];
    for (const [key, element] of Object.entries(this.props.chatList as ChatsData)) {
      element.isSelected = element.id === this.props.selected;
      itemsList.push(new ChatItem(element));
    }
    this.children.chatItemsList = itemsList;
  }
}

const withChats = withStore((state) => ({...state.chats}));
export const ChatList = withChats(ChatListBase);