import Block from '../../utils/Block';
import template from './dropdown.pug';
import * as dropdownStyles from './dropdown.module.scss';

interface DropdownProps {
  items: Block<Record<string, unknown>>[],
  styles?: Record<string, unknown>
}

export class Dropdown extends Block<DropdownProps> {
  constructor(props: DropdownProps) {
    super(props);
    this.element!.classList.add(dropdownStyles.dropdown);
  }

  protected editPropsBeforeMakeThemProxy(props: DropdownProps) {
    props.styles = dropdownStyles;
  }

  protected render() {
    return this.compile(template, this.props);
  }
}
