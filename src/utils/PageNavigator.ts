import { Profile } from '../modules/Profile';
import { ProfilePage } from '../pages/Profile';
import { Form } from '../modules/Form';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { AuthorizationPage } from '../pages/Authorization';
import { RegistrationPage } from '../pages/Registration';
import Block from './Block';
import { ErrorPage } from '../pages/Error';
import { ChatPage } from '../pages/Chat';

import logoutIcon from '../../static/icon/logout.svg';
import beforeIcon from '../../static/icon/before.svg';
import moreVertIcon from '../../static/icon/more-vert.svg';

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
        phone: '8 (920) 900-10-20',
        renderStatus: 'show',
        logoutSvg: logoutIcon,
        backSvg: beforeIcon,
        menuSvg: moreVertIcon,
      }),
    }));
  }

  static renderAuthorizationPage(): void {
    PageNavigator.renderPage(new AuthorizationPage({
      form: new Form({
        action: '',
        method: '',
        title: 'Вход',
        inputs: [
          new Input({
            title: 'Логин',
            type: 'text',
            name: 'login',
            value: '',
            placeholder: 'Логин',
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
            placeholder: 'Пароль',
            isRounded: false,
            isLight: false,
            displayBlock: true,
            iconSrc: null,
          }),
        ],
        buttons: [
          new Button({
            text: 'Войти',
            events: {
              click: () => PageNavigator.renderChatPage(),
            },
            isTransparent: false,
            isBordered: false,
            isWhite: false,
            displayBlock: true,
          }),
          new Button({
            text: 'Создать профиль',
            events: {
              click: () => PageNavigator.renderRegistrationPage(),
            },
            isTransparent: true,
            isBordered: false,
            isWhite: false,
            displayBlock: true,
          }),
        ],
      }),
    }));
  }

  static renderRegistrationPage(): void {
    PageNavigator.renderPage(new RegistrationPage({
      form: new Form({
        action: '',
        method: '',
        title: 'Регистрация',
        inputs: [
          new Input({
            title: 'Почта',
            type: 'text',
            name: 'email',
            value: '',
            placeholder: 'Почта',
            isRounded: false,
            isLight: false,
            displayBlock: true,
            iconSrc: null,
          }),
          new Input({
            title: 'Логин',
            type: 'text',
            name: 'login',
            value: '',
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
            value: '',
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
            value: '',
            placeholder: 'Фамилия',
            isRounded: false,
            isLight: false,
            displayBlock: true,
            iconSrc: null,
          }),
          new Input({
            title: 'Телефон',
            type: 'text',
            name: 'phone',
            value: '',
            placeholder: 'Телефон',
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
            placeholder: 'Пароль',
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
            placeholder: 'Пароль (еще раз)',
            isRounded: false,
            isLight: false,
            displayBlock: true,
            iconSrc: null,
          }),
        ],
        buttons: [
          new Button({
            text: 'Зарегистрироваться',
            events: {
              click: () => PageNavigator.renderChatPage(),
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
      }),
    }));
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
