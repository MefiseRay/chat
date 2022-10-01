import Block from '../../utils/Block';
import template from './chat.pug';
import { ChatList } from './components/ChatList';

import * as chatStyles from './chat.module.scss';
import { ChatMessages } from './components/ChatMessages';

export interface ChatProps {
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

  protected render() {
    this._initChatList();
    this._initChatMessage();
    return this.compile(template, this.props);
  }

  private _initChatList() {
    this.children.chatList = new ChatList({
      addChatIconSrc: this.props.addChatIconSrc,
      searchIconSrc: this.props.searchIconSrc,
    });
  }

  private _initChatMessage() {
    this.children.chatMessages = new ChatMessages({
      menuIconSrc: this.props.menuIconSrc,
      attachFileIconSrc: this.props.attachFileIconSrc,
      sendIconSrc: this.props.sendIconSrc,
    });
  }
}
