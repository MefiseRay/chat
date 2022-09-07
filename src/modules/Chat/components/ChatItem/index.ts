import Block from '../../../../utils/Block';
import template from './chatItem.pug';

import * as chatItemStyles from './chatItem.module.scss';
import { Avatar } from '../../../../components/Avatar';

export interface ChatItemProps {
    chatId: string,
    imageSrc: string,
    name: string,
    message: {
        text: string,
        dateTime: string,
    },
    notRead: number,
    selected: boolean,
    styles?: Record<string, unknown>
}

export class ChatItem extends Block {
  constructor(props: ChatItemProps) {
    super('div', props);
        this.element!.classList.add(chatItemStyles.item);
  }

  protected editPropsBeforeMakeThemProxy(props: ChatItemProps) {
    props.styles = chatItemStyles;
  }

  protected init() {
    this.children.image = new Avatar({
      src: this.props.imageSrc,
      size: '3em',
      alt: this.props.name,
      title: this.props.name,
    });
        this.children.image.getContent()!.style.padding = '1px';
        this.children.image.getContent()!.style.boxShadow = 'none';
  }

  render() {
    if (this.props.selected) {
            this.element!.classList.add(chatItemStyles.active);
    } else {
            this.element!.classList.remove(chatItemStyles.active);
    }
    return this.compile(template, this.props);
  }

  isSelected() {
    return this.props.selected;
  }

  removeSelection() {
    this.props.selected = false;
  }

  select() {
    this.props.selected = true;
  }
}
