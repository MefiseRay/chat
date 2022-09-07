import Block from '../../utils/Block';
import template from './avatar.pug';
import * as avatarStyles from './avatar.module.scss';

interface AvatarProps {
    src: string,
    size: string,
    alt: string,
    title: string,
    styles?: Record<string, unknown>
}

export class Avatar extends Block {
  constructor(props: AvatarProps) {
    super('div', props);
        this.element!.classList.add(avatarStyles.avatar);
        this.element!.style.height = props.size;
        this.element!.style.width = props.size;
  }

  protected editPropsBeforeMakeThemProxy(props: AvatarProps) {
    props.styles = avatarStyles;
  }

  render() {
    return this.compile(template, this.props);
  }
}
