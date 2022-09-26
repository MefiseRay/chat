import Block from '../../utils/Block';
import template from './chat.pug';
import {ChatList, ChatListBase} from './components/ChatList';

import * as chatStyles from './chat.module.scss';
import {ChatItem} from './components/ChatItem';
import {ChatMessages} from './components/ChatMessages';

export interface ChatProps {
  userId: string,
  addChatIconSrc: string,
  searchIconSrc: string,
  menuIconSrc: string,
  attachFileIconSrc: string,
  sendIconSrc: string,
  styles?: Record<string, unknown>
}

export class Chat extends Block<ChatProps> {
  constructor(props: ChatProps) {
    super(props);
    this.element!.classList.add(chatStyles.wrapper);
  }

  protected editPropsBeforeMakeThemProxy(props: ChatProps) {
    props.styles = chatStyles;
  }

  protected init() {
    this.children.chatList = new ChatList({
      addChatIconSrc: this.props.addChatIconSrc,
      searchIconSrc: this.props.searchIconSrc,
    });
    this._addSelectChatEvents();
  }

  protected render() {
    return this.compile(template, this.props);
  }

  private _addSelectChatEvents() {
    const chatList = (this.children.chatList as ChatListBase).children.chatItemsList;
    if (Array.isArray(chatList)) {
      (chatList as ChatItem[]).forEach((targetChatItem: ChatItem) => {
        targetChatItem.getContent()!.addEventListener('click', () => {
          (chatList as ChatItem[]).forEach((item: ChatItem) => {
            item.removeSelection();
          });
          targetChatItem.select();
          console.log(`Открыт чат ${targetChatItem.getPropValue('id')}`);
          this.children.chatMessages = new ChatMessages({
            chatId: targetChatItem.getPropValue('id'),
            profile: this._getProfileData(this.props.userId),
            menuIconSrc: this.props.menuIconSrc,
            attachFileIconSrc: this.props.attachFileIconSrc,
            sendIconSrc: this.props.sendIconSrc,
          });
          this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
        });
      });
    }
  }

  private _getProfileData(id: string): {
    id: string,
    avatarSrc: string,
    login: string,
    firstName: string,
    secondName: string,
    email: string,
    phone: string,
  } {
    return {
      id,
      avatarSrc: '/upload/img/user_avatar.jpg',
      login: 'RayMefise',
      firstName: 'Max',
      secondName: 'Zaitsev',
      email: 'max.zaitsev@site.ru',
      phone: '8 (920) 900-10-20',
    };
  }
}
