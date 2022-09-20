import Block from '../../utils/Block';
import template from './profile.pug';
import { Avatar } from '../../components/Avatar';
import { Icon } from '../../components/Icon';
import { DropdownMenu } from '../../components/DropdownMenu';
import { Button } from '../../components/Button';
import { MenuButton } from '../../components/MenuButton';
import * as profileStyles from './profile.module.scss';
import { PageNavigator } from '../../utils/PageNavigator';
import { Form } from '../Form';
import { Input, InputTypes } from '../../components/Input';
import ValidationHelper from '../../utils/ValidationHelper';

interface ProfileProps {
    avatarSrc: string,
    login: string,
    firstName: string,
    secondName: string,
    email: string,
    phone: string,
    renderStatus: string,
    logoutSvg: string,
    backSvg: string,
    menuSvg: string,
    styles?: Record<string, unknown>
}

export class Profile extends Block<ProfileProps> {
  static RENDER_STATUSES = {
    SHOW: 'show',
    CHANGE_DATA: 'changeData',
    CHANGE_PASSWORD: 'changePassword',
  };

  constructor(props: ProfileProps) {
    super(props);
        this.element!.classList.add(profileStyles.profile);
  }

  protected editPropsBeforeMakeThemProxy(props: ProfileProps) {
    props.styles = profileStyles;
  }

  protected init() {
    this._addAvatar();
    this._addLogoutButton();
    this._addBackButton();
    this._addMenu();
    this._addChangeDataForm();
    this._addChangePasswordForm();
  }

  private _addChangeDataForm() {
    this.children.changeDataForm = new Form({
      action: '',
      method: '',
      title: '',
      inputs: [
        new Input({
          title: 'Логин',
          type: InputTypes.text,
          name: 'login',
          value: this.props.login,
          placeholder: 'Логин',
          isRounded: false,
          isLight: false,
          displayBlock: true,
          iconSrc: null,
          validation: {
            required: true,
            trim: true,
            callback: (value: string, required?:boolean, trim?:boolean) => ValidationHelper
              .loginValidation(value, required, trim),
          },
        }),
        new Input({
          title: 'Имя',
          type: InputTypes.text,
          name: 'first_name',
          value: this.props.firstName,
          placeholder: 'Имя',
          isRounded: false,
          isLight: false,
          displayBlock: true,
          iconSrc: null,
          validation: {
            required: true,
            trim: true,
            callback: (value: string, required?:boolean, trim?:boolean) => ValidationHelper
              .nameValidation(value, required, trim),
          },
        }),
        new Input({
          title: 'Фамилия',
          type: InputTypes.text,
          name: 'second_name',
          value: this.props.secondName,
          placeholder: 'Фамилия',
          isRounded: false,
          isLight: false,
          displayBlock: true,
          iconSrc: null,
          validation: {
            required: true,
            trim: true,
            callback: (value: string, required?:boolean, trim?:boolean) => ValidationHelper
              .secondNameValidation(value, required, trim),
          },
        }),
        new Input({
          title: 'Почта',
          type: InputTypes.email,
          name: 'email',
          value: this.props.email,
          placeholder: 'Почта',
          isRounded: false,
          isLight: false,
          displayBlock: true,
          iconSrc: null,
          validation: {
            required: true,
            trim: true,
            callback: (value: string, required?:boolean, trim?:boolean) => ValidationHelper
              .emailValidation(value, required, trim),
          },
        }),
        new Input({
          title: 'Телефон',
          type: InputTypes.tel,
          name: 'phone',
          value: this.props.phone,
          placeholder: 'Телефон',
          isRounded: false,
          isLight: false,
          displayBlock: true,
          iconSrc: null,
          validation: {
            required: true,
            trim: true,
            callback: (value: string, required?:boolean, trim?:boolean) => ValidationHelper
              .phoneValidation(value, required, trim),
          },
        }),
      ],
      buttons: [
        new Button({
          text: 'Сохранить',
          events: {
            click: (event) => {
              event.stopPropagation();
              event.preventDefault();
              const { validate, formData } = (this.children.changeDataForm as Form).checkValidate();
              if (validate) {
                console.log(formData);
                this._changeRenderStatus(Profile.RENDER_STATUSES.SHOW);
              }
            },
          },
          isTransparent: false,
          isBordered: false,
          isWhite: false,
          displayBlock: true,
        }),
      ],
    });
  }

  private _addChangePasswordForm() {
    this.children.changePasswordForm = new Form({
      action: '',
      method: '',
      title: '',
      inputs: [
        new Input({
          title: 'Пароль',
          type: InputTypes.password,
          name: 'old_password',
          value: '',
          placeholder: 'Текущий пароль',
          isRounded: false,
          isLight: false,
          displayBlock: true,
          iconSrc: null,
          validation: {
            required: true,
            trim: true,
            callback: (value: string, required?:boolean, trim?:boolean) => ValidationHelper
              .passwordValidation(value, required, trim),
          },
        }),
        new Input({
          title: 'Пароль',
          type: InputTypes.password,
          name: 'password',
          value: '',
          placeholder: 'Новый пароль',
          isRounded: false,
          isLight: false,
          displayBlock: true,
          iconSrc: null,
          validation: {
            required: true,
            trim: true,
            callback: (value: string, required?:boolean, trim?:boolean) => ValidationHelper
              .passwordValidation(value, required, trim),
          },
        }),
        new Input({
          title: 'Пароль (еще раз)',
          type: InputTypes.password,
          name: 'password_confirmation',
          value: '',
          placeholder: 'Новый пароль (еще раз)',
          isRounded: false,
          isLight: false,
          displayBlock: true,
          iconSrc: null,
          validation: {
            required: true,
            trim: true,
            callback: (value: string, required?:boolean, trim?:boolean) => ValidationHelper
              .passwordValidation(value, required, trim),
          },
        }),
      ],
      buttons: [
        new Button({
          text: 'Сохранить',
          events: {
            click: (event) => {
              event.stopPropagation();
              event.preventDefault();
              const {
                validate,
                formData,
              } = (this.children.changePasswordForm as Form).checkValidate();
              if (validate) {
                console.log(formData);
                this._changeRenderStatus(Profile.RENDER_STATUSES.SHOW);
              }
            },
          },
          isTransparent: false,
          isBordered: false,
          isWhite: false,
          displayBlock: true,
        }),
      ],
    });
  }

  private _addMenu() {
    this.children.menuButton = new MenuButton({
      icon: new Icon({
        size: '2em',
        icon: this.props.menuSvg,
      }),
      menu: new DropdownMenu({
        items: [
          {
            text: 'Изменить даныне',
            click: () => this._changeRenderStatus(Profile.RENDER_STATUSES.CHANGE_DATA),
          },
          {
            text: 'Изменить пароль',
            click: () => this._changeRenderStatus(Profile.RENDER_STATUSES.CHANGE_PASSWORD),
          },
        ],
      }),
      horizontalShift: -5,
      verticalShift: 5,
    });
  }

  private _addAvatar() {
    this.children.avatar = new Avatar({
      src: this.props.avatarSrc,
      size: '6em',
      alt: this.props.login,
      title: this.props.login,
    });
  }

  private _addLogoutButton() {
    this.children.logoutIcon = new Icon({
      size: '3em',
      icon: this.props.logoutSvg,
    });
        this.children.logoutIcon.element!.addEventListener(
          'click',
          () => PageNavigator.renderAuthorizationPage(),
        );
        this.children.logoutIcon.element!.classList.add(profileStyles['button-icon']);
  }

  private _addBackButton() {
    this.children.backIcon = new Icon({
      size: '2em',
      icon: this.props.backSvg,
    });
        this.children.backIcon.element!.addEventListener('click', () => {
          if (this.props.renderStatus === 'show') {
            PageNavigator.renderChatPage();
          } else {
            this._changeRenderStatus(Profile.RENDER_STATUSES.SHOW);
          }
        });
        this.children.backIcon.element!.classList.add(profileStyles['button-icon']);
  }

  private _changeRenderStatus(renderStatus: string) {
    const menuButton = this.children.menuButton as MenuButton;
    switch (renderStatus) {
      case Profile.RENDER_STATUSES.CHANGE_DATA:
        this.props.renderStatus = Profile.RENDER_STATUSES.CHANGE_DATA;
        menuButton.removeMenu();
        menuButton.hide();
        break;
      case Profile.RENDER_STATUSES.CHANGE_PASSWORD:
        this.props.renderStatus = Profile.RENDER_STATUSES.CHANGE_PASSWORD;
        menuButton.removeMenu();
        menuButton.hide();
        break;
      default:
        this.props.renderStatus = Profile.RENDER_STATUSES.SHOW;
        menuButton.show();
        break;
    }
  }

  protected render() {
    return this.compile(template, this.props);
  }
}
