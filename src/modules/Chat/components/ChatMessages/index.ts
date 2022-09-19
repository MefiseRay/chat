import Block from '../../../../utils/Block';
import template from './chatMessages.pug';
import * as chatMessagesStyles from './chatMessages.module.scss';
import { Avatar } from '../../../../components/Avatar';
import { Icon } from '../../../../components/Icon';
import { Input, InputTypes } from '../../../../components/Input';
import { MenuButton } from '../../../../components/MenuButton';
import { DropdownMenu } from '../../../../components/DropdownMenu';
import { ChatMessagesBlock, ChatMessagesBlockProps } from '../ChatMessagesBlock';

export interface ChatMessagesProps {
    chatId: string,
    profile: {
        id: string,
        avatarSrc: string,
        login: string,
        firstName: string,
        secondName: string,
        email: string,
        phone: string,
    }
    menuIconSrc: string,
    attachFileIconSrc: string,
    sendIconSrc: string,
    chatData?: Record<string, unknown>,
    styles?: Record<string, unknown>
}

export class ChatMessages extends Block {
  constructor(props: ChatMessagesProps) {
    super('div', props);
        this.element!.classList.add(chatMessagesStyles.chat);
  }

  protected editPropsBeforeMakeThemProxy(props: ChatMessagesProps) {
    props.chatData = this._getChatData(props.chatId, props.profile.id);
    props.styles = chatMessagesStyles;
  }

  protected init() {
    this._addChatImage();
    this._addChatMenu();
    this._addAttachFile();
    this._addMessageInput();
    this._addSendButton();
    this._addMessageBlocks();
  }

  protected render() {
    return this.compile(template, this.props);
  }

  private _addChatImage() {
    this.children.chatImage = new Avatar({
      src: this.props.chatData.imageSrc,
      size: '2em',
      alt: this.props.chatData.name,
      title: this.props.chatData.name,
    });
  }

  private _addChatMenu() {
    this.children.chatMenu = new MenuButton({
      icon: new Icon({
        size: '1.5em',
        icon: this.props.menuIconSrc,
      }),
      menu: new DropdownMenu({
        items: [
          {
            text: 'Изменить',
            click: () => {
              console.log('Выбран пунк меню: Изменить');
            },
          },
          {
            text: 'Очистить',
            click: () => {
              console.log('Выбран пунк меню: Очистить сообщения');
            },
          },
          {
            text: 'Покинуть',
            click: () => {
              console.log('Выбран пунк меню: Удалить чат');
            },
          },
        ],
      }),
      horizontalShift: -5,
      verticalShift: 5,
    });
  }

  private _addAttachFile() {
    this.children.attachFile = new Icon({
      size: '1.5em',
      icon: this.props.attachFileIconSrc,
    });
  }

  private _addMessageInput() {
    this.children.messageInput = new Input({
      title: 'Введите свое сообщение',
      type: InputTypes.text,
      name: 'messageInput',
      value: '',
      placeholder: 'Введите свое сообщение',
      isRounded: true,
      isLight: true,
      displayBlock: true,
      iconSrc: null,
    });
  }

  private _addSendButton() {
    this.children.sendButton = new Icon({
      size: '1.5em',
      icon: this.props.sendIconSrc,
    });
  }

  private _addMessageBlocks() {
    this.children.messageBlocks = [];
    this.props.chatData.messages.forEach((messageData:ChatMessagesBlockProps) => {
      (this.children.messageBlocks as ChatMessagesBlock[]).push(new ChatMessagesBlock(messageData));
    });
  }

  private _getChatData(chatId: string, userId: string) {
    let imageSrc = '';
    if (chatId.length < 2) {
      imageSrc = `/upload/img/cat_0${chatId}.jpg`;
    } else {
      imageSrc = `/upload/img/cat_${chatId}.jpg`;
    }
    const profiles = {
      RayMefise: {
        id: '1234567890',
        avatarSrc: '/upload/img/user_avatar.jpg',
        login: 'RayMefise',
        firstName: 'Max',
        secondName: 'Zaitsev',
        email: 'max.zaitsev@site.ru',
        phone: '8 (920) 900-10-20',
      },
      Misha: {
        id: '1234567891',
        avatarSrc: '/upload/img/misha_avatar.jpg',
        login: 'JustAngel',
        firstName: 'Misha',
        secondName: 'Collins',
        email: 'misha.kolins@site.ru',
        phone: '8 (920) 800-10-20',
      },
      Din: {
        id: '1234567892',
        avatarSrc: '/upload/img/din_avatar.jpg',
        login: 'ToughGuy',
        firstName: 'Dean',
        secondName: 'Winchester',
        email: 'misha.kolins@site.ru',
        phone: '8 (920) 800-10-20',
      },
    };
    return {
      chatId,
      imageSrc,
      name: `Чат с номером ${chatId}`,
      messages: [
        {
          userId,
          date: '10.08',
          massages: [
            {
              profile: profiles.Misha,
              time: '12:40',
              status: 'isRead',
              messageImage: '',
              messageText: 'Приятно, граждане, наблюдать, как диаграммы связей ассоциативно распределены по отраслям.',
            },
            {
              profile: profiles.Misha,
              time: '13:45',
              status: 'isRead',
              messageImage: '',
              messageText: 'Мы вынуждены отталкиваться от того, что сплочённость команды профессионалов позволяет выполнить важные задания по разработке благоприятных перспектив.',
            },
            {
              profile: profiles.Misha,
              time: '18:27',
              status: 'isRead',
              messageImage: '',
              messageText: 'Высокий уровень вовлечения представителей целевой аудитории является четким доказательством простого факта: сложившаяся структура организации позволяет выполнить важные задания по разработке поставленных обществом задач.',
            },
            {
              profile: profiles.RayMefise,
              time: '19:56',
              status: 'isRead',
              messageImage: '',
              messageText: 'Разнообразный и богатый опыт говорит нам, что консультация с широким активом предоставляет широкие возможности для направлений прогрессивного развития.',
            },
            {
              profile: profiles.Misha,
              time: '18:27',
              status: 'isRead',
              messageImage: '',
              messageText: 'Каждый из нас понимает очевидную вещь: консультация с широким активом является качественно новой ступенью позиций, занимаемых участниками в отношении поставленных задач.',
            },
          ],
        },
        {
          userId,
          date: 'ПТ',
          massages: [
            {
              profile: profiles.Misha,
              time: '11:22',
              status: 'isRead',
              messageImage: '',
              messageText: 'Смотри на какой машине вчера гонял!',
            },
            {
              profile: profiles.Misha,
              time: '11:22',
              status: 'isRead',
              messageImage: '/upload/img/message_01.jpg',
              messageText: '',
            },
            {
              profile: profiles.RayMefise,
              time: '11:24',
              status: 'isRead',
              messageImage: '',
              messageText: 'Это же тачка из вашего сериала?',
            },
            {
              profile: profiles.RayMefise,
              time: '11:24',
              status: 'isRead',
              messageImage: '/upload/img/message_02.jpg',
              messageText: '',
            },
            {
              profile: profiles.Din,
              time: '11:30',
              status: 'isRead',
              messageImage: '',
              messageText: 'Миша, ВЕРНИ МАШИНУ! Это реквизит!!!',
            },
          ],
        },
        {
          userId,
          date: 'Сегодня',
          massages: [
            {
              profile: profiles.Misha,
              time: '10:04',
              status: 'isRead',
              messageImage: '',
              messageText: 'Идейные соображения высшего порядка, а также постоянное информационно-пропагандистское обеспечение нашей деятельности обеспечивает актуальность системы массового участия.',
            },
            {
              profile: profiles.Misha,
              time: '13:48',
              status: 'isRead',
              messageImage: '',
              messageText: 'Таким образом, курс на социально-ориентированный национальный проект напрямую зависит от поставленных обществом задач.',
            },
            {
              profile: profiles.RayMefise,
              time: '14:24',
              status: 'isRead',
              messageImage: '',
              messageText: 'А ещё непосредственные участники технического прогресса заблокированы в рамках своих собственных рациональных ограничений.',
            },
            {
              profile: profiles.RayMefise,
              time: '14:24',
              status: 'isSend',
              messageImage: '',
              messageText: 'Также как высокое качество позиционных исследований предполагает независимые способы реализации новых предложений.',
            },
            {
              profile: profiles.RayMefise,
              time: '14:24',
              status: '',
              messageImage: '',
              messageText: 'С другой стороны, синтетическое тестирование напрямую зависит от экономической целесообразности принимаемых решений.',
            },
          ],
        },
      ],
    };
  }
}
