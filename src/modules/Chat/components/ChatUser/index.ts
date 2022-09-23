import Block from '../../../../utils/Block';
import template from './chatUser.pug';
import * as chatUserStyles from './chatUser.module.scss';
import { Avatar } from '../../../../components/Avatar';
import {withStore} from "../../../../utils/Store";

export interface ChatUserProps {
    // noAvatar: Avatar,
    // login: string,
    events: {
        click: (event: Event) => void;
    },
}

export class ChatUserBase extends Block<ChatUserProps> {
  constructor(props: ChatUserProps) {
    super(props);
    this.element!.classList.add(chatUserStyles.user);
    this.children.noAvatar = new Avatar({
      src: '/upload/img/user_avatar.jpg',
      size: '2em',
      alt: this.props.login,
      title: this.props.login,
    });
  }

  protected render() {
    return this.compile(template, this.props);
  }
}

const withUser = withStore((state) => ({ ...state.user }));
export const ChatUser = withUser(ChatUserBase);