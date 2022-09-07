import Block from '../../utils/Block';
import template from './input.pug';
import * as inputStyles from './input.module.scss';
import { Icon } from '../Icon';

interface InputProps {
    title: string,
    type: string,
    name: string,
    value: string,
    placeholder: string,
    isRounded: boolean,
    isLight: boolean,
    displayBlock: boolean,
    iconSrc: string | null,
    styles?: Record<string, unknown>
}

export class Input extends Block {
  constructor(props: InputProps) {
    super('div', props);
        this.element!.classList.add(inputStyles.input);
        if (props.isRounded) {
            this.element!.classList.add(inputStyles.rounded);
            if (props.isLight) this.element!.classList.add(inputStyles.light);
        }
        if (props.displayBlock) {
            this.element!.classList.add(inputStyles.block);
        }
  }

  protected editPropsBeforeMakeThemProxy(props: InputProps) {
    props.styles = inputStyles;
  }

  protected init() {
    if (this.props.iconSrc != null) {
      this.children.icon = new Icon({
        size: '1em',
        icon: this.props.iconSrc,
      });
    }
  }

  render() {
    return this.compile(template, this.props);
  }
}
