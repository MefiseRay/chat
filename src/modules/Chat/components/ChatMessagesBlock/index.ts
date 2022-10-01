import Block from '../../../../utils/Block';
import template from './chatMessagesBlock.pug';
import * as chatMessagesBlockStyles from './chatMessagesBlock.module.scss';
import { withStore } from '../../../../utils/Store';
import { ChatMessage, MessageData } from '../ChatMessage';
import { User } from '../../../../api/UsersAPI';

export interface ChatMessagesBlockProps {
  styles?: Record<string, unknown>
}

export class ChatMessagesBlockBase extends Block<Record<string, unknown>> {
  private userList:Record<string, User> = {};

  constructor(props: Record<string, unknown>) {
    super(props);
    this.element!.classList.add(chatMessagesBlockStyles['messages-block']);
  }

  protected editPropsBeforeMakeThemProxy(props: ChatMessagesBlockProps) {
    props.styles = chatMessagesBlockStyles;
  }

  protected render() {
    if (this.props.selected) {
      this._getUserList();
      this._createMessages();
    } else {
      this.children.messagesList = [];
    }
    return this.compile(template, this.props);
  }

  private _createMessages() {
    this.children.messagesList = [];
    if (this.props.list && Array.isArray(this.props.list)) {
      this.props.list.forEach((message: MessageData) => {
        if (this.userList[message.user_id]) {
          const messageBlock = new ChatMessage({
            message,
            author: this.userList[message.user_id],
            myMessage: this.props.id === message.user_id,
          });
          (this.children.messagesList as ChatMessage[]).push(messageBlock);
        }
      });
    }
  }

  private _getUserList() {
    const userList:Record<string, User> = {};
    this.props.chatList[this.props.selected].user_list.forEach((user: User) => {
      userList[user.id] = user;
    });
    this.userList = userList;
  }
}

const withMessagesAndUser = withStore((state) => ({
  ...state.messages,
  ...state.user,
  ...state.chats,
}));
export const ChatMessagesBlock = withMessagesAndUser(ChatMessagesBlockBase);
