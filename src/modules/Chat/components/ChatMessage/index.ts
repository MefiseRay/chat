import Block from '../../../../utils/Block';
import template from './chatMessage.pug';
import * as chatMessageStyles from './chatMessage.module.scss';
import { Icon } from '../../../../components/Icon';
import isSendIcon from '../../../../../static/icon/done.svg';
import isReadIcon from '../../../../../static/icon/done-all.svg';
import { User } from '../../../../api/UsersAPI';
import { fileData } from '../../../../api/ResourcesAPI';

export interface ChatMessageProps {
  message: MessageData,
  author: User,
  myMessage: boolean
  styles?: Record<string, unknown>
}

export interface MessageData {
  id: number;
  user_id: string;
  chat_id: string;
  content: string;
  file: fileData | null;
  is_read: false;
  time: string;
  type: string;
}

export interface ChatMessagesList {
  list: MessageData[]
}

export class ChatMessage extends Block<ChatMessageProps> {
  constructor(props: ChatMessageProps) {
    super(props);
    this.element!.classList.add(chatMessageStyles.message);
    if (this.props.message.file) {
      this.element!.classList.add(chatMessageStyles['image-message']);
    }
    if (this.props.myMessage) {
      this.setMessageMy();
    }
  }

  protected init() {
    if (this.props.message.is_read) {
      this.children.icon = new Icon({
        size: '1em',
        icon: isReadIcon,
      });
    } else {
      this.children.icon = new Icon({
        size: '1em',
        icon: isSendIcon,
      });
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
