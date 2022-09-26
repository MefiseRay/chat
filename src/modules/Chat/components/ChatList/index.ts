import Block from '../../../../utils/Block';
import template from './chatList.pug';
import * as chatListStyles from './chatList.module.scss';
import {Icon} from '../../../../components/Icon';
import {Input, InputTypes} from '../../../../components/Input';
import {ChatItem, ChatItemProps} from '../ChatItem';
import {ChatUser, ChatUserBase} from '../ChatUser';
import Router from "../../../../utils/Router";
import {Routes} from "../../../../index";
import ChatsController from "../../../../controllers/ChatsController";
import store, {withStore} from "../../../../utils/Store";
import {ChatData} from "../../../../api/ChatsAPI";

export interface ChatListProps {
  addChatIconSrc: string,
  searchIconSrc: string,
  addCallback: (chatId: string) => void
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

  protected init() {
    this._addButton();
    this._addSearchInput();
    this._addItemsList();
    this._addChatUser();
  }

  protected render() {
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
      this.props.selected = await ChatsController.create("Новый чат");
      this.props.addCallback(this.props.selected);
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
    const itemsList: ChatItem[] = [];
    this.props.chatList.forEach((element: ChatData) => {
      itemsList.push(new ChatItem(element));
    });
    this.children.chatItemsList = itemsList;
  }
}

const withChats = withStore((state) => ({...state.chats}));
export const ChatList = withChats(ChatListBase);