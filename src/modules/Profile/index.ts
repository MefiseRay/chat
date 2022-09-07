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
import { Input } from '../../components/Input';

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

export class Profile extends Block {
  static RENDER_STATUSES = {
    SHOW: 'show',
    CHANGE_DATA: 'changeData',
    CHANGE_PASSWORD: 'changePassword',
  };

  constructor(props: ProfileProps) {
    super('div', props);
        this.element!.classList.add(profileStyles.profile);
  }

  protected editPropsBeforeMakeThemProxy(props: ProfileProps) {
    props.styles = profileStyles;
  }

  protected init() {
    this.addAvatar();
    this.addLogoutButton();
    this.addBackButton();
    this.addMenu();
    this.addChangeDataForm();
    this.addChangePasswordForm();
  }

  protected addChangeDataForm() {
    this.children.changeDataForm = new Form({
      action: '',
      method: '',
      title: '',
      inputs: [
        new Input({
          title: 'Логин',
          type: 'text',
          name: 'login',
          value: this.props.login,
          placeholder: 'Логин',
          isRounded: false,
          isLight: false,
          displayBlock: true,
          iconSrc: null,
        }),
        new Input({
          title: 'Имя',
          type: 'text',
          name: 'first_name',
          value: this.props.firstName,
          placeholder: 'Имя',
          isRounded: false,
          isLight: false,
          displayBlock: true,
          iconSrc: null,
        }),
        new Input({
          title: 'Фамилия',
          type: 'text',
          name: 'second_name',
          value: this.props.secondName,
          placeholder: 'Фамилия',
          isRounded: false,
          isLight: false,
          displayBlock: true,
          iconSrc: null,
        }),
        new Input({
          title: 'Почта',
          type: 'text',
          name: 'email',
          value: this.props.email,
          placeholder: 'Почта',
          isRounded: false,
          isLight: false,
          displayBlock: true,
          iconSrc: null,
        }),
        new Input({
          title: 'Телефон',
          type: 'text',
          name: 'phone',
          value: this.props.phone,
          placeholder: 'Телефон',
          isRounded: false,
          isLight: false,
          displayBlock: true,
          iconSrc: null,
        }),
      ],
      buttons: [
        new Button({
          text: 'Сохранить',
          events: {
            click: (event) => {
              event.stopPropagation();
              event.preventDefault();
              this.changeRenderStatus(Profile.RENDER_STATUSES.SHOW);
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

  protected addChangePasswordForm() {
    this.children.changePasswordForm = new Form({
      action: '',
      method: '',
      title: '',
      inputs: [
        new Input({
          title: 'Пароль',
          type: 'password',
          name: 'old_password',
          value: '',
          placeholder: 'Текущий пароль',
          isRounded: false,
          isLight: false,
          displayBlock: true,
          iconSrc: null,
        }),
        new Input({
          title: 'Пароль',
          type: 'password',
          name: 'password',
          value: '',
          placeholder: 'Новый пароль',
          isRounded: false,
          isLight: false,
          displayBlock: true,
          iconSrc: null,
        }),
        new Input({
          title: 'Пароль (еще раз)',
          type: 'password',
          name: 'password_confirmation',
          value: '',
          placeholder: 'Новый пароль (еще раз)',
          isRounded: false,
          isLight: false,
          displayBlock: true,
          iconSrc: null,
        }),
      ],
      buttons: [
        new Button({
          text: 'Сохранить',
          events: {
            click: (event) => {
              event.stopPropagation();
              event.preventDefault();
              this.changeRenderStatus(Profile.RENDER_STATUSES.SHOW);
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

  protected addMenu() {
    this.children.menuButton = new MenuButton({
      icon: new Icon({
        size: '2em',
        icon: this.props.menuSvg,
      }),
      menu: new DropdownMenu({
        items: [
          new Button({
            text: 'Изменить даныне',
            events: {
              click: () => {
                this.changeRenderStatus(Profile.RENDER_STATUSES.CHANGE_DATA);
              },
            },
            isTransparent: true,
            isBordered: false,
            isWhite: false,
            displayBlock: true,
          }),
          new Button({
            text: 'Изменить пароль',
            events: {
              click: () => {
                this.changeRenderStatus(Profile.RENDER_STATUSES.CHANGE_PASSWORD);
              },
            },
            isTransparent: true,
            isBordered: false,
            isWhite: false,
            displayBlock: true,
          }),
        ],
      }),
      horizontalShift: -5,
      verticalShift: 5,
    });
  }

  protected addAvatar() {
    this.children.avatar = new Avatar({
      src: this.props.avatarSrc,
      size: '6em',
      alt: this.props.login,
      title: this.props.login,
    });
  }

  protected addLogoutButton() {
    this.children.logoutIcon = new Icon({
      size: '3em',
      icon: this.props.logoutSvg,
    });
        this.children.logoutIcon.element!.addEventListener('click', () => PageNavigator.renderAuthorizationPage());
        this.children.logoutIcon.element!.classList.add(profileStyles.buttonIcon);
  }

  protected addBackButton() {
    this.children.backIcon = new Icon({
      size: '2em',
      icon: this.props.backSvg,
    });
        this.children.backIcon.element!.addEventListener('click', () => {
          if (this.props.renderStatus === 'show') {
            PageNavigator.renderChatPage();
          } else {
            this.changeRenderStatus(Profile.RENDER_STATUSES.SHOW);
          }
        });
        this.children.backIcon.element!.classList.add(profileStyles.buttonIcon);
  }

  protected changeRenderStatus(renderStatus: string) {
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

  render() {
    return this.compile(template, this.props);
  }
}
