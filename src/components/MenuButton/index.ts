import Block from '../../utils/Block';
import template from './menuButton.pug';
import {Icon} from '../Icon';
import {DropdownMenu} from '../DropdownMenu';

import * as menuButtonStyles from './menuButton.module.scss';
import {makeDropdown} from "../../utils/Helpers";

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
    const menu = this.children.menu as DropdownMenu;
    const icon = this.children.icon as Icon;
    icon.element!.addEventListener('click', (event: MouseEvent) => {
      const {horizontalShift} = this.props;
      const {verticalShift} = this.props;
      makeDropdown(this.children.menu as DropdownMenu, event.target as HTMLElement,horizontalShift,verticalShift);
    });
  }

  public removeMenu() {
    const menu = this.children.menu as DropdownMenu;
    menu.element!.remove();
  }

  protected render() {
    return this.compile(template, this.props);
  }
}
