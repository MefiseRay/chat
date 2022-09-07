import Block from "../../utils/Block";
import template from "./chat.pug";
import {Chat} from "../../modules/Chat";
import addChatIcon from "../../../static/icon/add.svg";
import searchIcon from "../../../static/icon/search.svg";
import menuIcon from "../../../static/icon/more-vert.svg";
import attachFileIcon from "../../../static/icon/attach.svg";
import sendIcon from "../../../static/icon/send.svg";

interface ChatPageProps {}

export class ChatPage extends Block {

    constructor(props: ChatPageProps) {
        super('div', props);
    }

    protected init() {
        this.children.chat = new Chat({
            userId: "1234567890",
            addChatIconSrc: addChatIcon,
            searchIconSrc: searchIcon,
            menuIconSrc: menuIcon,
            attachFileIconSrc: attachFileIcon,
            sendIconSrc: sendIcon
        });
    }

    render() {
        return this.compile(template, this.props);
    }
}