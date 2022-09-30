import Block from '../../../../utils/Block';
import template from './chatMessages.pug';
import * as chatMessagesStyles from './chatMessages.module.scss';
import {Avatar} from '../../../../components/Avatar';
import {Icon} from '../../../../components/Icon';
import {Input, InputTypes} from '../../../../components/Input';
import {MenuButton} from '../../../../components/MenuButton';
import {DropdownMenu} from '../../../../components/DropdownMenu';
import {withStore} from "../../../../utils/Store";
import ChatsController from "../../../../controllers/ChatsController";
import {closeDropdown} from "../../../../utils/Helpers";
import {ChatProfile} from "../ChatProfile";
import {ChatWebSocket} from "../../../../utils/ChatWebSocket";

export interface ChatMessagesProps {
  menuIconSrc: string,
  attachFileIconSrc: string,
  sendIconSrc: string,
  styles?: Record<string, unknown>
}

export interface MessageData {
  id: number;
  user_id: string;
  chat_id: string;
  content: string;
  file: null;
  is_read: false;
  time: string;
  type: string;
}
export interface ChatMessagesList {
  list: MessageData[]
}

export class ChatMessagesBase extends Block<ChatMessagesProps> {

  private webSocket:ChatWebSocket | null = null;

  constructor(props: ChatMessagesProps) {
    super(props);
    this.element!.classList.add(chatMessagesStyles.chat);
  }

  protected editPropsBeforeMakeThemProxy(props: Record<string, unknown>) {
    props.styles = chatMessagesStyles;
  }

  protected render() {
    if(this.props.openProfile) {
      this._addChatProfileBlocks()
    } else if (this.props.selected) {
      this._createWebSocket();
      this._addChatImage();
      this._addChatMenu();
      this._addAttachFile();
      this._addMessageInput();
      this._addSendButton();
      this._addSendAction();
      this._addMessageBlocks();
    }
    return this.compile(template, this.props);
  }

  private _addChatImage() {
    this.children.chatImage = new Avatar({
      src: this.props.chatList[this.props.selected].avatar ?? "",
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
    })
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
    // this.props.chatData.messages.forEach((messageData: ChatMessagesBlockProps) => {
    //   (this.children.messageBlocks as ChatMessagesBlock[]).push(new ChatMessagesBlock(messageData));
    // });
  }

  private _addChatProfileBlocks() {
    this.children.chatProfile = new ChatProfile({});
  }

  private _createWebSocket() {
    if(this.props.socketUserId && this.props.socketChatId && this.props.socketToken) {
      this.webSocket = new ChatWebSocket(this.props.socketUserId, this.props.socketChatId, this.props.socketToken);
    } else {
      this.webSocket = null;
    }
  }

  private _addSendAction() {
    (this.children.sendButton as Icon).element!.addEventListener('click', (event: MouseEvent) => {
      if(this.webSocket) {
        const value = (this.children.messageInput as Input).getValue();
        this.webSocket.sendMessage(value);
      }
    });
    (this.children.sendButton as Icon).element!.style.cursor = 'pointer';
  }
}

const withChatsAndUser = withStore((state) => ({...state.chats, ...state.user, ...state.socket}));
export const ChatMessages = withChatsAndUser(ChatMessagesBase);
