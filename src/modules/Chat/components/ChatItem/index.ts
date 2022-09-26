import Block from '../../../../utils/Block';
import template from './chatItem.pug';

import * as chatItemStyles from './chatItem.module.scss';
import {Avatar} from '../../../../components/Avatar';
import {ChatData} from "../../../../api/ChatsAPI";

export interface ChatItemProps {
  styles?: Record<string, unknown>
}

export class ChatItem extends Block<ChatData> {
  constructor(props: ChatData) {
    super(props);
    this.element!.classList.add(chatItemStyles.item);
  }

  protected editPropsBeforeMakeThemProxy(props: ChatItemProps & ChatData) {
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
    if (this.props.selected) {
      this.element!.classList.add(chatItemStyles.active);
    } else {
      this.element!.classList.remove(chatItemStyles.active);
    }
    return this.compile(template, this.props);
  }

  public isSelected() {
    return this.props.selected;
  }

  public removeSelection() {
    this.props.selected = false;
  }

  public select() {
    this.props.selected = true;
  }
}
