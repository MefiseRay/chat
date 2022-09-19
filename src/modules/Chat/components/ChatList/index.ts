import Block from '../../../../utils/Block';
import template from './chatList.pug';
import * as chatListStyles from './chatList.module.scss';
import { Avatar } from '../../../../components/Avatar';
import { PageNavigator } from '../../../../utils/PageNavigator';
import { Icon } from '../../../../components/Icon';
import { Input, InputTypes } from '../../../../components/Input';
import { ChatItem, ChatItemProps } from '../ChatItem';
import { ChatUser } from '../ChatUser';

export interface ChatListProps {
    profile: {
        id: string,
        avatarSrc: string,
        login: string,
        firstName: string,
        secondName: string,
        email: string,
        phone: string,
    }
    addChatIconSrc: string,
    searchIconSrc: string,
    styles?: Record<string, unknown>
}

export class ChatList extends Block {
  constructor(props: ChatListProps) {
    super(props);
        this.element!.classList.add(chatListStyles.wrapper);
  }

  protected editPropsBeforeMakeThemProxy(props: ChatListProps) {
    props.styles = chatListStyles;
  }

  protected init() {
    this._addAvatar();
    this._addButton();
    this._addSearchInput();
    this._addItemsList();
    this._addChatUser();
  }

  protected render() {
    return this.compile(template, this.props);
  }

  private _addChatUser() {
    this.children.chatUser = new ChatUser({
      avatar: new Avatar({
        src: this.props.profile.avatarSrc,
        size: '2em',
        alt: this.props.profile.login,
        title: this.props.profile.login,
      }),
      login: this.props.profile.login,
      events: {
        click: () => {
          PageNavigator.renderProfilePage();
        },
      },
    });
  }

  private _addAvatar() {
    this.children.avatar = new Avatar({
      src: this.props.profile.avatarSrc,
      size: '2em',
      alt: this.props.profile.login,
      title: this.props.profile.login,
    });
  }

  private _addButton() {
    this.children.addButton = new Icon({
      size: '1.5em',
      icon: this.props.addChatIconSrc,
    });
        this.children.addButton.element!.addEventListener('click', () => {
          console.log('Нажата кнопка добавления нового чата');
        });
  }

  private _addSearchInput() {
    this.children.searchInput = new Input({
      title: 'Поиск',
      type: InputTypes.text,
      name: 'search',
      value: '',
      placeholder: 'Поиск',
      isRounded: true,
      isLight: true,
      displayBlock: true,
      iconSrc: this.props.searchIconSrc,
    });
  }

  private _addItemsList() {
    const itemsList: ChatItem[] = [];
    this._testItemsData().forEach((element: ChatItemProps) => {
      itemsList.push(new ChatItem(element));
    });
    this.children.chatItemsList = itemsList;
  }

  private _testItemsData():ChatItemProps[] {
    const itemsData: ChatItemProps[] = [];
    let notRead = 0;
    for (let i = 1; i <= 20; i++) {
      const min = Math.ceil(-80);
      const max = Math.floor(80);
      notRead = Math.floor(Math.random() * (max - min + 1)) + min;

      let imageSrc = '';
      if (i < 10) {
        imageSrc = `/upload/img/cat_0${i}.jpg`;
      } else {
        imageSrc = `/upload/img/cat_${i}.jpg`;
      }
      itemsData.push({
        chatId: `${i}`,
        imageSrc,
        name: `Чат с номером ${i}`,
        message: {
          text: 'Случайный текст для проверки отображение его в списке чатов. '
                        + 'Случайный текст для проверки отображение его в списке чатов.',
          dateTime: '20:43',
        },
        notRead: notRead > 0 ? notRead : 0,
        selected: false,
      });
    }
    return itemsData;
  }
}
