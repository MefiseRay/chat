import Block from '../../utils/Block';
import template from './form.pug';
import * as formStyles from './form.module.scss';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

interface FormProps {
    action: string,
    method: string,
    title: string,
    inputs: Input[],
    buttons: Button[],
    styles?: Record<string, unknown>
}

export class Form extends Block {
  constructor(props: FormProps) {
    super('div', props);
        this.element!.classList.add(formStyles.form);
  }

  protected editPropsBeforeMakeThemProxy(props: FormProps) {
    props.styles = formStyles;
  }

  render() {
    return this.compile(template, this.props);
  }
}
