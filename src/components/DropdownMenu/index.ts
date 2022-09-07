import Block from '../../utils/Block';
import template from './dropdownMenu.pug';
import { Button } from '../Button';

import * as dropdownMenuStyles from './dropdownMenu.module.scss';

interface DropdownMenuProps {
    items: Button[],
    styles?: Record<string, unknown>
}

export class DropdownMenu extends Block {
  constructor(props: DropdownMenuProps) {
    super('div', props);
        this.element!.classList.add(dropdownMenuStyles.dropdown);
  }

  protected editPropsBeforeMakeThemProxy(props: DropdownMenuProps) {
    props.styles = dropdownMenuStyles;
  }

  protected init() {
    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((childEl) => {
                    childEl.element!.classList.add(dropdownMenuStyles.button);
        });
      }
    });
  }

  render() {
    return this.compile(template, this.props);
  }
}
