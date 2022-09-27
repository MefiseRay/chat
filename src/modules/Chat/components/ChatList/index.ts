import Block from '../../../../utils/Block';
import template from './chatList.pug';
import * as chatListStyles from './chatList.module.scss';
import {Icon} from '../../../../components/Icon';
import {Input, InputTypes} from '../../../../components/Input';
import {ChatItem} from '../ChatItem';
import {ChatUser, ChatUserBase} from '../ChatUser';
import Router from "../../../../utils/Router";
import {Routes} from "../../../../index";
import ChatsController from "../../../../controllers/ChatsController";
import store, {withStore} from "../../../../utils/Store";
import {ChatData, ChatsData} from "../../../../api/ChatsAPI";

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
    this.children.addButton.element!.addEventListener('click', async () => {
      await ChatsController.create("Новый чат");
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