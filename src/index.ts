import { PageNavigator } from './utils/PageNavigator';
import * as styles from './styles.module.scss';

window.addEventListener('DOMContentLoaded', () => {
  PageNavigator.getRoot().classList.add(styles.app);
  // по умолчанию отображается страница авторизации
  PageNavigator.renderAuthorizationPage();
  // необходимо раскоментировать для првоерки отображения страницы с ошибкой 500
  // PageNavigator.render500Page();
  // необходимо раскоментировать для првоерки отображения страницы с ошибкой 404
  // PageNavigator.render404Page();
  PageNavigator.renderChatPage();
});
