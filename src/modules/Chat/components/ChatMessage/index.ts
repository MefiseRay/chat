import Block from '../../../../utils/Block';
import template from './chatMessage.pug';
import * as chatMessageStyles from './chatMessage.module.scss';
import { Icon } from '../../../../components/Icon';
import isSendIcon from '../../../../../static/icon/done.svg';
import isReadIcon from '../../../../../static/icon/done-all.svg';

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

export class ChatMessage extends Block<ChatMessageProps> {
  constructor(props: ChatMessageProps) {
    super(props);
        this.element!.classList.add(chatMessageStyles.message);
        if (this.props.messageImage) {
            this.element!.classList.add(chatMessageStyles['image-message']);
        }
  }

  protected init() {
    switch (this.props.status) {
      case 'isRead':
        this.children.icon = new Icon({
          size: '1em',
          icon: isReadIcon,
        });
        break;
      case 'isSend':
        this.children.icon = new Icon({
          size: '1em',
          icon: isSendIcon,
        });
        break;
      default:
        break;
    }
  }

  protected editPropsBeforeMakeThemProxy(props: ChatMessageProps) {
    props.styles = chatMessageStyles;
  }

  protected render() {
    return this.compile(template, this.props);
  }

  public setMessageMy() {
        this.element!.classList.add(chatMessageStyles['my-message']);
  }
}
