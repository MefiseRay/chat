import Block from '../../../../utils/Block';
import template from './chatMessages.pug';
import * as chatMessagesStyles from './chatMessages.module.scss';
import {Avatar} from '../../../../components/Avatar';
import {Icon} from '../../../../components/Icon';
import {Input, InputTypes} from '../../../../components/Input';
import {MenuButton} from '../../../../components/MenuButton';
import {DropdownMenu} from '../../../../components/DropdownMenu';
import {ChatMessagesBlock, ChatMessagesBlockProps} from '../ChatMessagesBlock';
import {withStore} from "../../../../utils/Store";
import {ChatData, ChatsData} from "../../../../api/ChatsAPI";

export interface ChatMessagesProps {
  chatId?: string,
  menuIconSrc: string,
  attachFileIconSrc: string,
  sendIconSrc: string,
  deleteCallback: (chatId: string) => void;
  styles?: Record<string, unknown>
}

export class ChatMessagesBase extends Block<ChatMessagesProps> {
  constructor(props: ChatMessagesProps) {
    super(props);
    this.element!.classList.add(chatMessagesStyles.chat);
  }

  protected editPropsBeforeMakeThemProxy(props: ChatMessagesProps & ChatsData) {
    console.log(props);
    props.styles = chatMessagesStyles;
  }

  protected init() {
    if(this.props.chatId) {
      this._addChatImage();
      this._addChatMenu();
      this._addAttachFile();
      this._addMessageInput();
      this._addSendButton();
      // this._addMessageBlocks();
    }
  }

  protected render() {
    return this.compile(template, this.props);
  }

  private _addChatImage() {
    this.children.chatImage = new Avatar({
      src: this.props.chatList[this.props.chatId].avatar,
      size: '2em',
      alt: this.props.chatList[this.props.chatId].title,
      title: this.props.chatList[this.props.chatId].title,
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
            text: 'Покинуть',
            click: () => {
              this.props.deleteCallback(this.props.chatId);
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
    this.props.chatData.messages.forEach((messageData: ChatMessagesBlockProps) => {
      (this.children.messageBlocks as ChatMessagesBlock[]).push(new ChatMessagesBlock(messageData));
    });
  }

  private _updateChatData(chatId?: string) {
    if(chatId) {
      this.props.chatData = this.props.chat[chatId];
    }
  }
}

const withUser = withStore((state) => ({...state.user}));
const withChats = withStore((state) => ({...state.chats}));
export const ChatMessages = withChats(withUser(ChatMessagesBase));
