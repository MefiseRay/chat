// import { PageNavigator } from './utils/PageNavigator';
import * as styles from './styles.module.scss';
import Router from './utils/Router';
import AuthController from './controllers/AuthController';
import {AuthorizationPage} from "./pages/Authorization";
import {RegistrationPage} from "./pages/Registration";
import {ProfilePage} from "./pages/Profile";

export enum Routes {
  Index = '/',
  Register = '/register',
  Profile = '/profile'
}

window.addEventListener('DOMContentLoaded', async () => {
  const root:Element = document.querySelector('#app')!;
  root.classList.add(styles.app);
  Router
    .use(Routes.Index, AuthorizationPage)
    .use(Routes.Register, RegistrationPage)
    .use(Routes.Profile, ProfilePage)

  let isProtectedRoute = true;

  switch (window.location.pathname) {
    case Routes.Index:
    case Routes.Register:
      isProtectedRoute = false;
      break;
  }

  try {
    await AuthController.fetchUser();

    Router.start();

    if (!isProtectedRoute) {
      Router.go(Routes.Profile)
    }
  } catch (e) {
    Router.start();

    if (isProtectedRoute) {
      Router.go(Routes.Index);
    }
  }

});
