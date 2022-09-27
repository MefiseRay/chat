import Block from '../../utils/Block';
import template from './dropdownMenu.pug';
import {Button} from '../Button';

import * as dropdownMenuStyles from './dropdownMenu.module.scss';

export interface DropdownMenuItemsProps {
  text: string,
  click: () => void,
}

export interface DropdownMenuProps {
  items: DropdownMenuItemsProps[],
  styles?: Record<string, unknown>
}

export class DropdownMenu extends Block<DropdownMenuProps> {
  constructor(props: DropdownMenuProps) {
    super(props);
    this.element!.classList.add(dropdownMenuStyles.dropdown);
  }

  protected editPropsBeforeMakeThemProxy(props: DropdownMenuProps) {
    props.styles = dropdownMenuStyles;
  }

  protected init() {
    this.children.buttons = [];
    this.props.items.forEach((item: DropdownMenuItemsProps) => {
      const button = new Button({
        text: item.text,
        events: {
          click: () => item.click(),
        },
        isTransparent: true,
        isBordered: false,
        isWhite: false,
        displayBlock: true,
        isMenuElement: true,
      });
      (this.children.buttons as Button[]).push(button);
    });
  }

  protected render() {
    return this.compile(template, this.props);
  }
}
