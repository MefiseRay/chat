import Block from '../../../../utils/Block';
import template from './chatMessages.pug';
import * as chatMessagesStyles from './chatMessages.module.scss';
import { Avatar } from '../../../../components/Avatar';
import { Icon } from '../../../../components/Icon';
import { Input, InputTypes } from '../../../../components/Input';
import { MenuButton } from '../../../../components/MenuButton';
import { DropdownMenu } from '../../../../components/DropdownMenu';
import { withStore } from '../../../../utils/Store';
import ChatsController from '../../../../controllers/ChatsController';
import { closeDropdown, makeDropdown } from '../../../../utils/Helpers';
import { ChatProfile } from '../ChatProfile';
import { ChatMessagesBlock } from '../ChatMessagesBlock';
import { Form } from '../../../Form';
import { Button } from '../../../../components/Button';
import { UserChangeable } from '../../../../api/UsersAPI';
import { Dropdown } from '../../../../components/Dropdown';

export interface ChatMessagesProps {
  menuIconSrc: string,
  attachFileIconSrc: string,
  sendIconSrc: string,
  styles?: Record<string, unknown>
}

export class ChatMessagesBase extends Block<ChatMessagesProps> {
  constructor(props: ChatMessagesProps) {
    super(props);
    this.element!.classList.add(chatMessagesStyles.chat);
  }

  protected editPropsBeforeMakeThemProxy(props: Record<string, unknown>) {
    props.styles = chatMessagesStyles;
  }

  protected init() {
    this._addMessageBlocks();
  }

  protected render() {
    if (this.props.openProfile) {
      this._addChatProfileBlocks();
    } else if (this.props.selected) {
      this._addChatImage();
      this._addChatMenu();
      this._addChatForm();
      this._addAttachFile();
      this._addMessageInput();
      this._addSendButton();
      this._addSendAction();
    }
    return this.compile(template, this.props);
  }

  private _addChatImage() {
    this.children.chatImage = new Avatar({
      src: this.props.chatList[this.props.selected].avatar ?? '',
      size: '2em',
      alt: this.props.chatList[this.props.selected].title,
      title: this.props.chatList[this.props.selected].title,
    });
  }

  private _addChatMenu() {
    const menu = new DropdownMenu({
      items: [
        {
          text: 'Изменить',
          click: () => {
            ChatsController.openProfile(this.props.selected);
            closeDropdown(menu);
          },
        },
        {
          text: 'Покинуть',
          click: async () => {
            await ChatsController.delete(this.props.selected);
            closeDropdown(menu);
          },
        },
      ],
    });
    this.children.chatMenu = new MenuButton({
      icon: new Icon({
        size: '1.5em',
        icon: this.props.menuIconSrc,
      }),
      menu,
      horizontalShift: -5,
      verticalShift: 5,
    });
  }

  private _addAttachFile() {
    this.children.attachFile = new Icon({
      size: '1.5em',
      icon: this.props.attachFileIconSrc,
    });
    (this.children.attachFile as Icon).element!
      .addEventListener('click', (event: MouseEvent) => {
        makeDropdown(
        this.children.dropdownForm as Form<Record<string, unknown>>,
        event.target as HTMLElement,
        );
      });
    (this.children.attachFile as Icon).element!.style.cursor = 'pointer';
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
    this.children.messageBlock = new ChatMessagesBlock({});
  }

  private _addChatProfileBlocks() {
    this.children.chatProfile = new ChatProfile({});
  }

  private _addSendAction() {
    (this.children.sendButton as Icon).element!.addEventListener('click', () => {
      this._sendMessage();
    });
    (this.children.messageInput as Icon).element!.addEventListener('keyup', (event:KeyboardEvent) => {
      if (event.code === 'Enter') {
        this._sendMessage();
      }
    });
    (this.children.sendButton as Icon).element!.style.cursor = 'pointer';
  }

  private _sendMessage() {
    const webSocket = ChatsController.getChatWebSocket();
    if (webSocket) {
      const value = (this.children.messageInput as Input).getValue();
      if (value) {
        webSocket.sendMessage(value);
        (this.children.messageInput as Input).clearValue();
      }
    }
  }

  private _addChatForm() {
    this.children.sendFileForm = new Form({
      action: '',
      method: '',
      title: '',
      inputs: [
        new Input({
          title: 'Файл',
          type: InputTypes.file,
          name: 'resource',
          value: this.props.login,
          placeholder: 'Файл',
          isRounded: false,
          isLight: false,
          displayBlock: true,
          iconSrc: null,
        }),
      ],
      buttons: [
        new Button({
          text: 'Отправить',
          events: {
            click: async (event) => {
              event.stopPropagation();
              event.preventDefault();
              const formData = (this.children.sendFileForm as Form<UserChangeable>).getFormData();
              closeDropdown(this.children.dropdownForm as Form<UserChangeable>);
              if (formData) {
                if ((formData.get('resource') as File).name !== '') {
                  const webSocket = ChatsController.getChatWebSocket();
                  if (webSocket) {
                    await webSocket.sendFile(formData);
                  }
                }
              }
            },
          },
          isTransparent: false,
          isBordered: false,
          isWhite: false,
          displayBlock: true,
        }),
      ],
      compact: true,
    });
    this.children.dropdownForm = new Dropdown({
      items: [this.children.sendFileForm],
    });
  }
}

const withChatsAndUser = withStore((state) => ({ ...state.chats, ...state.user }));
export const ChatMessages = withChatsAndUser(ChatMessagesBase);
