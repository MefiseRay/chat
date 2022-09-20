import Block from '../../utils/Block';
import template from './registration.pug';

import * as centralAreaStyles from '../../layouts/CentralArea/centralArea.module.scss';

import { Form } from '../../modules/Form';
import {Input, InputTypes} from "../../components/Input";
import ValidationHelper from "../../utils/ValidationHelper";
import {Button} from "../../components/Button";
import {SignUpData} from "../../api/AuthAPI";
import {Routes} from "../../index";
import Router from "../../utils/Router";
import AuthController from '../../controllers/AuthController';

export class RegistrationPage extends Block<{}> {
  constructor() {
    super({});
        this.element!.classList.add(centralAreaStyles.wrapper);
  }

  protected init() {
    const form: Form<SignUpData> = new Form({
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
            click: async (event: Event) => {
              event.stopPropagation();
              event.preventDefault();
              const {validate, formData} = form.checkValidate();
              if (validate) {
                await AuthController.signUp(formData);
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
            click: () => Router.go(Routes.Index)
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
