import Block from '../../../../utils/Block';
import template from './chatItem.pug';

import * as chatItemStyles from './chatItem.module.scss';
import {Avatar} from '../../../../components/Avatar';
import {ChatData} from "../../../../api/ChatsAPI";
import ChatsController from "../../../../controllers/ChatsController";
import {withStore} from "../../../../utils/Store";
import {ChatListBase} from "../ChatList";

export interface ChatItemProps extends ChatData {
  styles?: Record<string, unknown>
  isSelected: boolean;
}

export class ChatItem extends Block<ChatItemProps> {
  constructor(props: ChatItemProps) {
    super(props);
    this.element!.classList.add(chatItemStyles.item);
    this.element!.click();
    this.element!.addEventListener('click',  async () => {
      await ChatsController.select(this.props.id);
    });
  }

  protected editPropsBeforeMakeThemProxy(props: ChatItemProps) {
    props.styles = chatItemStyles;
  }

  protected init() {
    this.children.image = new Avatar({
      src: this.props.avatar,
      size: '3em',
      alt: this.props.name,
      title: this.props.name,
    });
    this.children.image.getContent()!.style.padding = '1px';
    this.children.image.getContent()!.style.boxShadow = 'none';
  }

  protected render() {
    if (this.props.isSelected) {
      this.element!.classList.add(chatItemStyles.active);
    } else {
      this.element!.classList.remove(chatItemStyles.active);
    }
    return this.compile(template, this.props);
  }
}
