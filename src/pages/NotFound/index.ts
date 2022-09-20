import Block from "../../utils/Block";
import template from "./notFound.pug";
import * as errorStyles from "../../modules/Error/error.module.scss";
import {ErrorPage} from "../../modules/Error";
import Router from "../../utils/Router";
import {Routes} from "../../index";
import AuthController from "../../controllers/AuthController";


export class NotFoundPage extends Block<{}> {

  constructor() {
    super({});
  }

  protected init() {
    this.props.styles = errorStyles;
    this.children.errorPage = new ErrorPage({
      code: '404',
      text: 'Похоже вы заблудились.',
      buttonText: 'Назад к чатам',
      buttonOnClick: async () => {
        try {
          await AuthController.fetchUser();
          Router.go(Routes.Profile)
        } catch (e) {
          Router.go(Routes.Index);
        }
      },
    })
  }

  protected render() {
    return this.compile(template, this.props);
  }
}