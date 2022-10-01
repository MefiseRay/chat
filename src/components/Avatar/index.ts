import Block from '../../utils/Block';
import template from './avatar.pug';
import * as avatarStyles from './avatar.module.scss';
import HTTPTransport from '../../utils/HTTPTransport';

interface AvatarProps {
  src: string,
  size: string,
  alt: string,
  title: string,
  styles?: Record<string, unknown>
}

export class Avatar extends Block<AvatarProps> {
  static NO_IMAGE = '/upload/img/noimage.jpg';

  constructor(props: AvatarProps) {
    super(props);
    this.element!.classList.add(avatarStyles.avatar);
    this.element!.style.height = props.size;
    this.element!.style.width = props.size;
  }

  protected editPropsBeforeMakeThemProxy(props: AvatarProps) {
    props.styles = avatarStyles;
    if (!props.src || props.src === '') {
      props.src = Avatar.NO_IMAGE;
    } else {
      props.src = HTTPTransport.getFile(props.src);
    }
  }

  public changeAvatar(src: string) {
    if (!src || src === '') {
      this.props.src = Avatar.NO_IMAGE;
    } else {
      this.props.src = HTTPTransport.getFile(src);
    }
  }

  protected render() {
    return this.compile(template, this.props);
  }
}
