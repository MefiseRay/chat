import Block from '../../../../utils/Block';
import template from './chatUser.pug';
import * as chatUserStyles from './chatUser.module.scss';
import { Avatar } from '../../../../components/Avatar';
import { withStore } from '../../../../utils/Store';

export interface ChatUserProps {
  events: {
    click: (event: Event) => void;
  },
}

export class ChatUserBase extends Block<ChatUserProps> {
  constructor(props: ChatUserProps) {
    super(props);
    this.element!.classList.add(chatUserStyles.user);
  }

  protected init() {
    this.children.avatarBlock = new Avatar({
      src: this.props.avatar,
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
