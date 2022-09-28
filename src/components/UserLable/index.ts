import Block from "../../utils/Block";
import {User} from "../../api/UsersAPI";
import * as userLableStyles from "./userLable.module.scss";
import template from "./userLable.pug";
import {Avatar} from "../Avatar";
import {Icon} from "../Icon";
import {Input} from "../Input";

export interface UserLableProps {
  user: User,
  icon?: Icon,
  callBack?: () => void,
  styles?: Record<string, unknown>
}

export class UserLable extends Block<UserLableProps> {
  constructor(props: UserLableProps) {
    super(props);
    this.element!.classList.add(userLableStyles.lable);
  }

  protected editPropsBeforeMakeThemProxy(props: UserLableProps) {
    props.styles = userLableStyles;
  }

  protected init() {
    this._addAvatar();
    if(this.children.icon) {
      (this.children.icon as Icon).getContent()!.style.cursor = 'pointer';
      if(this.props.callBack) {
        (this.children.icon as Icon).element!.addEventListener('click',  () => this.props.callBack());
      }
    } else if(this.props.callBack) {
      this.element!.addEventListener('click',  () => this.props.callBack());
    }
  }

  private _addAvatar() {
    this.children.avatar = new Avatar({
      src: this.props.user.avatar,
      size: '1.5em',
      alt: this.props.user.login,
      title: this.props.user.login,
    });
    this.children.avatar.getContent()!.style.padding = '1px';
    this.children.avatar.getContent()!.style.boxShadow = 'none';
    this.children.avatar.getContent()!.style.background = 'none';
  }

  protected render() {
    return this.compile(template, this.props);
  }
}