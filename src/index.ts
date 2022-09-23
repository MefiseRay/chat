import * as styles from './styles.module.scss';
import Router from './utils/Router';
import AuthController from './controllers/AuthController';
import {AuthorizationPage} from "./pages/Authorization";
import {RegistrationPage} from "./pages/Registration";
import {ProfilePage} from "./pages/Profile";
import {NotFoundPage} from "./pages/NotFound";
import {ChatPage} from "./pages/Chat";

export enum Routes {
  Index = '/',
  Register = '/register',
  Profile = '/profile',
  NotFound = '/not-found',
  Chat = '/chat'
}

const routesPaths: String[] = Object.values(Routes);

window.addEventListener('DOMContentLoaded', async () => {
  const root: Element = document.querySelector('#app')!;
  root.classList.add(styles.app);
  Router
    .use(Routes.Index, AuthorizationPage)
    .use(Routes.Register, RegistrationPage)
    .use(Routes.Profile, ProfilePage)
    .use(Routes.NotFound, NotFoundPage)
    .use(Routes.Chat, ChatPage)

  let isProtectedRoute = true;

  switch (window.location.pathname) {
    case Routes.Index:
    case Routes.Register:
      isProtectedRoute = false;
      break;
  }
  if (routesPaths.includes(window.location.pathname)) {
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
  } else {
    console.log("404", window.location.pathname);
    Router.start();
    Router.go(Routes.NotFound);
  }


});
