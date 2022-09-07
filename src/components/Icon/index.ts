import Block from '../../utils/Block';
import template from './icon.pug';
import * as iconStyles from './icon.module.scss';

interface IconProps {
    size: string,
    icon: string
}

export class Icon extends Block {
  constructor(props: IconProps) {
    super('i', props);
        this.element!.classList.add(iconStyles.icon);
        this.element!.style.height = props.size;
        this.element!.style.width = props.size;
  }

  render() {
    return this.compile(template, this.props);
  }
}
