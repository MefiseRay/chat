/*
import { Profile } from '../modules/Profile';
import { ProfilePage } from '../pages/Profile';
import { Form } from '../modules/Form';
import { Input, InputTypes } from '../components/Input';
import { Button } from '../components/Button';
import { AuthorizationPage } from '../pages/Authorization';
import { RegistrationPage } from '../pages/Registration';
import Block from './Block';
import { ErrorPage } from '../pages/Error';
import { ChatPage } from '../pages/Chat';

import logoutIcon from '../../static/icon/logout.svg';
import beforeIcon from '../../static/icon/before.svg';
import moreVertIcon from '../../static/icon/more-vert.svg';
import ValidationHelper from './ValidationHelper';

export class PageNavigator {
  static root:Element = document.querySelector('#app')!;

  static setRoot(root: Element) {
    PageNavigator.root = root;
  }

  static getRoot(): Element {
    return PageNavigator.root;
  }

  static renderPage(block: Block) {
    PageNavigator.getRoot().innerHTML = '';
    PageNavigator.getRoot().append(block.getContent()!);
    block.dispatchComponentDidMount();
  }

  static renderChatPage() {
    PageNavigator.renderPage(new ChatPage({}));
  }

  static renderProfilePage() {
    PageNavigator.renderPage(new ProfilePage({
      profile: new Profile({
        avatarSrc: '/upload/img/user_avatar.jpg',
        login: 'RayMefise',
        firstName: 'Max',
        secondName: 'Zaitsev',
        email: 'max.zaitsev@site.ru',
        phone: '89209001020',
        renderStatus: 'show',
        logoutSvg: logoutIcon,
        backSvg: beforeIcon,
        menuSvg: moreVertIcon,
      }),
    }));
  }

  static renderAuthorizationPage(): void {
    const form: Form = new Form({
      action: '',
      method: '',
      title: 'Вход',
      inputs: [
        new Input({
          title: 'Логин',
          type: InputTypes.text,
          name: 'login',
          value: '',
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
          title: 'Пароль',
          type: InputTypes.password,
          name: 'password',
          value: '',
          placeholder: 'Пароль',
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
          text: 'Войти',
          events: {
            click: (event:Event) => {
              event.stopPropagation();
              event.preventDefault();
              const { validate, formData } = form.checkValidate();
              if (validate) {
                console.log(formData);
                PageNavigator.renderChatPage();
              }
            },
          },
          isTransparent: false,
          isBordered: false,
          isWhite: false,
          displayBlock: true,
        }),
        new Button({
          text: 'Создать профиль',
          events: {
            click: (event:Event) => {
              event.stopPropagation();
              event.preventDefault();
              PageNavigator.renderRegistrationPage();
            },
          },
          isTransparent: true,
          isBordered: false,
          isWhite: false,
          displayBlock: true,
        }),
      ],
    });
    PageNavigator.renderPage(new AuthorizationPage({ form }));
  }

  static renderRegistrationPage(): void {
    const form: Form = new Form({
      action: '',
      method: '',
      title: 'Регистрация',
      inputs: [
        new Input({
          title: 'Почта',
          type: InputTypes.email,
          name: 'email',
          value: '',
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
          title: 'Логин',
          type: InputTypes.text,
          name: 'login',
          value: '',
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
          value: '',
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
          value: '',
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
          title: 'Телефон',
          type: InputTypes.tel,
          name: 'phone',
          value: '',
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
        new Input({
          title: 'Пароль',
          type: InputTypes.password,
          name: 'password',
          value: '',
          placeholder: 'Пароль',
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
          placeholder: 'Пароль (еще раз)',
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
          text: 'Зарегистрироваться',
          events: {
            click: (event:Event) => {
              event.stopPropagation();
              event.preventDefault();
              const { validate, formData } = form.checkValidate();
              if (validate) {
                console.log(formData);
                PageNavigator.renderChatPage();
              }
            },
          },
          isTransparent: false,
          isBordered: false,
          isWhite: false,
          displayBlock: true,
        }),
        new Button({
          text: 'Войти',
          events: {
            click: () => PageNavigator.renderAuthorizationPage(),
          },
          isTransparent: true,
          isBordered: false,
          isWhite: false,
          displayBlock: true,
        }),
      ],
    });
    PageNavigator.renderPage(new RegistrationPage({ form }));
  }

  static render404Page(): void {
    PageNavigator.renderPage(new ErrorPage({
      code: '404',
      text: 'Похоже вы заблудились.',
      buttonText: 'Назад к чатам',
      buttonOnClick: () => {
        PageNavigator.renderChatPage();
      },
    }));
  }

  static render500Page(): void {
    PageNavigator.renderPage(new ErrorPage({
      code: '500',
      text: 'Упс! Похоже что-то сломалось.<br>Наши специалисты уже чинят.',
      buttonText: 'Назад к чатам',
      buttonOnClick: () => {
        PageNavigator.renderChatPage();
      },
    }));
  }
}
*/