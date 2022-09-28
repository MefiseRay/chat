import Block from "../../../../utils/Block";
import * as chatProfileStyles from "./chatProfile.module.scss";
import template from "./chatProfile.pug";
import {withStore} from "../../../../utils/Store";

export class ChatProfileBase extends Block<{}> {

  constructor() {
    super();
    this.element!.classList.add(chatProfileStyles.profile);
  }

  protected editPropsBeforeMakeThemProxy(props: Record<string, unknown>) {
    props.styles = chatProfileStyles;
  }

  protected render() {
    return this.compile(template, this.props);
  }
}

const withChatsAndUser = withStore((state) => ({...state.chats, ...state.user}));
export const ChatProfile = withChatsAndUser(ChatProfileBase);