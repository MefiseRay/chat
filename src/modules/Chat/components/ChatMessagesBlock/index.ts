import Block from '../../../../utils/Block';
import template from './chatMessagesBlock.pug';
import * as chatMessagesBlockStyles from './chatMessagesBlock.module.scss';
import { ChatMessage, ChatMessageProps } from '../ChatMessage';

export interface ChatMessagesBlockProps {
    userId: string,
    date: string,
    massages: ChatMessageProps[],
    styles?: Record<string, unknown>
}

export class ChatMessagesBlock extends Block {
  constructor(props: ChatMessagesBlockProps) {
    super('div', props);
        this.element!.classList.add(chatMessagesBlockStyles['messages-block']);
  }

  protected editPropsBeforeMakeThemProxy(props: ChatMessagesBlockProps) {
    props.styles = chatMessagesBlockStyles;
  }

  protected init() {
    (this.children.messagesList as ChatMessage[]) = [];
    (this.props.massages as ChatMessageProps[]).forEach((messageData: ChatMessageProps) => {
      const message = new ChatMessage(messageData);
      if (this.props.userId === messageData.profile.id) {
        message.setMessageMy();
      }
      (this.children.messagesList as ChatMessage[]).push(message);
    });
  }

  render() {
    return this.compile(template, this.props);
  }
}
