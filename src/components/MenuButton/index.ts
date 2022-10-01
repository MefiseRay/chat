import Block from '../../utils/Block';
import template from './menuButton.pug';
import { Icon } from '../Icon';
import { DropdownMenu } from '../DropdownMenu';

import * as menuButtonStyles from './menuButton.module.scss';
import { closeDropdown, makeDropdown } from '../../utils/Helpers';

interface MenuButtonProps {
  icon: Icon,
  menu: DropdownMenu,
  horizontalShift: number,
  verticalShift: number,
  styles?: Record<string, unknown>
}

export class MenuButton extends Block<MenuButtonProps> {
  constructor(props: MenuButtonProps) {
    super(props);
    this.element!.classList.add(menuButtonStyles.wrapper);
  }

  protected editPropsBeforeMakeThemProxy(props: MenuButtonProps) {
    props.styles = menuButtonStyles;
  }

  protected init() {
    (this.children.icon as Icon).element!.addEventListener('click', (event: MouseEvent) => {
      const { horizontalShift } = this.props;
      const { verticalShift } = this.props;
      makeDropdown(
        this.children.menu as DropdownMenu,
        event.target as HTMLElement,
        horizontalShift,
        verticalShift,
      );
    });
  }

  public removeMenu() {
    closeDropdown(this.children.menu as DropdownMenu);
  }

  protected render() {
    return this.compile(template, this.props);
  }
}
