import Block from '../../utils/Block';
import template from './error.pug';
import * as errorStyles from './error.module.scss';
import { Button } from '../../components/Button';

interface ErrorPageProps {
    code: string,
    text: string,
    buttonText: string,
    buttonOnClick: (event: Event) => void,
    styles?: Record<string, unknown>
}

export class ErrorPage extends Block {
  constructor(props: ErrorPageProps) {
    super('div', props);
        this.element!.classList.add(errorStyles.wrapper);
  }

  protected init() {
    this.props.styles = errorStyles;
    this.children.button = new Button({
      text: this.props.buttonText,
      events: {
        click: this.props.buttonOnClick,
      },
      isTransparent: true,
      isBordered: true,
      isWhite: true,
      displayBlock: true,
    });
  }

  protected render() {
    return this.compile(template, this.props);
  }
}
