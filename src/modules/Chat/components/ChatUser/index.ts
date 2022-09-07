import Block from '../../../../utils/Block';
import template from './chatUser.pug';
import * as chatUserStyles from './chatUser.module.scss';
import { Avatar } from '../../../../components/Avatar';

export interface ChatUserProps {
    avatar: Avatar,
    login: string,
    events: {
        click: (event: Event) => void;
    },
}

export class ChatUser extends Block {
  constructor(props: ChatUserProps) {
    super('div', props);
        this.element!.classList.add(chatUserStyles.user);
  }

  render() {
    return this.compile(template, this.props);
  }
}
