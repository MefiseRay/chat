import Block from '../../utils/Block';
import template from './button.pug';
import * as buttonStyles from './button.module.scss';

interface ButtonProps {
    text: string,
    events: {
        click: (event: Event) => void;
    },
    isTransparent: boolean,
    isBordered: boolean,
    isWhite: boolean,
    displayBlock: boolean,
    isMenuElement?: boolean
}

export class Button extends Block {
  constructor(props: ButtonProps) {
    super('button', props);
      this.element!.classList.add(buttonStyles.button);
      if (props.isTransparent) this.element!.classList.add(buttonStyles.transparent);
      if (props.isBordered) this.element!.classList.add(buttonStyles.bordered);
      if (props.isWhite) this.element!.classList.add(buttonStyles.white);
      if (props.displayBlock) this.element!.classList.add(buttonStyles.block);
      if (props.isMenuElement) this.element!.classList.add(buttonStyles['menu-element']);
  }

  protected render() {
    return this.compile(template, this.props);
  }
}
