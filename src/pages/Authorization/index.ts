import Block from '../../utils/Block';
import template from './authorization.pug';

import * as centralAreaStyles from '../../layouts/CentralArea/centralArea.module.scss';

import {Form} from '../../modules/Form';
import {Input, InputTypes} from "../../components/Input";
import ValidationHelper from "../../utils/ValidationHelper";
import {Button} from "../../components/Button";
import AuthController from '../../controllers/AuthController';
import {SignInData} from "../../api/AuthAPI";
import Router from "../../utils/Router";
import {Routes} from "../../index";

export class AuthorizationPage extends Block<{}> {
  constructor() {
    super({});
    this.element!.classList.add(centralAreaStyles.wrapper);
  }

  protected init() {
    const form: Form<SignInData> = new Form({
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
            callback: (value: string, required?: boolean, trim?: boolean) => ValidationHelper
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
            callback: (value: string, required?: boolean, trim?: boolean) => ValidationHelper
              .passwordValidation(value, required, trim),
          },
        }),
      ],
      buttons: [
        new Button({
          text: 'Войти',
          events: {
            click: async (event: Event) => {
              event.stopPropagation();
              event.preventDefault();
              const {validate, formData} = form.checkValidate();
              if (validate) {
                await AuthController.signIn(formData)
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
            click: (event: Event) => {
              event.stopPropagation();
              event.preventDefault();
              Router.go(Routes.Register);
            },
          },
          isTransparent: true,
          isBordered: false,
          isWhite: false,
          displayBlock: true,
        }),
      ],
    });
    this.children.form = form;
    this.props.centralAreaStyles = centralAreaStyles;
  }

  protected render() {
    return this.compile(template, this.props);
  }
}
