import Block from "../../../../utils/Block";
import * as chatProfileStyles from "./chatProfile.module.scss";
import template from "./chatProfile.pug";
import {withStore} from "../../../../utils/Store";
import {Avatar} from "../../../../components/Avatar";
import {Input, InputTypes} from "../../../../components/Input";
import {debounce} from "../../../../utils/Helpers";
import UsersController from "../../../../controllers/UsersController";
import ChatsController from "../../../../controllers/ChatsController";

export class ChatProfileBase extends Block<{}> {

  constructor(props: {}) {
    super(props);
    this.element!.classList.add(chatProfileStyles.wrapper);
  }

  protected editPropsBeforeMakeThemProxy(props: Record<string, unknown>) {
    props.styles = chatProfileStyles;
  }

  protected render() {
    this._addChatImage();
    this._addChatNameInput();
    console.log(this.props.chatList);
    return this.compile(template, this.props);
  }

  private _addChatImage() {
    this.children.chatImage = new Avatar({
      src: this.props.chatList[this.props.openProfile].avatar,
      size: '8em',
      alt: this.props.chatList[this.props.openProfile].title,
      title: this.props.chatList[this.props.openProfile].title,
    });
  }

  private _addChatNameInput() {
    const debouncedChangeName = debounce(async (chatName: string) => {
      // this.props.userList = await ChatsController.;
    }, 1000);
    this.children.chatName = new Input({
      title: 'Название чата',
      type: InputTypes.text,
      name: 'name',
      value: this.props.chatList[this.props.openProfile].title,
      placeholder: 'Название чата',
      isRounded: true,
      isLight: true,
      displayBlock: true,
      iconSrc: null,
    });
    this.children.chatName.element!.addEventListener('keyup',  () => {
      debouncedChangeName((this.children.search as Input).getValue());
    });
  }
}

const withChatsAndUser = withStore((state) => ({...state.chats, ...state.user}));
export const ChatProfile = withChatsAndUser(ChatProfileBase);