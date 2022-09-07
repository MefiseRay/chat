import Block from '../../../../utils/Block';
import template from './chatMessage.pug';
import * as chatMessageStyles from './chatMessage.module.scss';

export interface ChatMessageProps {
    profile: {
        id: string,
        avatarSrc: string,
        login: string,
        firstName: string,
        secondName: string,
        email: string,
        phone: string,
    },
    time: string,
    status: string,
    messageText?: string,
    messageImage?: string,
    styles?: Record<string, unknown>
}

export class ChatMessage extends Block {
  constructor(props: ChatMessageProps) {
    super('div', props);
        this.element!.classList.add(chatMessageStyles.message);
        if (this.props.messageImage) {
            this.element!.classList.add(chatMessageStyles.imageMessage);
        }
  }

  protected editPropsBeforeMakeThemProxy(props: ChatMessageProps) {
    props.styles = chatMessageStyles;
  }

  render() {
    return this.compile(template, this.props);
  }

  setMessageMy() {
        this.element!.classList.add(chatMessageStyles.myMessage);
  }
}
