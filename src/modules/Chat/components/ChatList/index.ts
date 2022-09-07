import Block from '../../../../utils/Block';
import template from './chatList.pug';
import * as chatListStyles from "./chatList.module.scss";
import {Avatar} from "../../../../components/Avatar";
import {PageNavigator} from "../../../../utils/PageNavigator";
import {Icon} from "../../../../components/Icon";
import {Input} from "../../../../components/Input";
import {ChatItem, ChatItemProps} from "../ChatItem";
import {ChatUser} from "../ChatUser";

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
    styles?: string
}

export class ChatList extends Block {

    constructor(props: ChatListProps) {
        super('div', props);
        this.element!.classList.add(chatListStyles["wrapper"]);
    }

    protected editPropsBeforeMakeThemProxy(props: ChatListProps) {
        props.styles = chatListStyles;
    }

    protected init() {
        this.addAvatar();
        this.addButton();
        this.addSearchInput();
        this.addItemsList();
        this.addChatUser();
    }

    render() {
        return this.compile(template, this.props);
    }

    protected addChatUser() {
        this.children.chatUser = new ChatUser({
            avatar: new Avatar({
                src: this.props.profile.avatarSrc,
                size: "2em",
                alt: this.props.profile.login,
                title: this.props.profile.login
            }),
            login: this.props.profile.login,
            events: {
                click: (event: Event) => {
                    PageNavigator.renderProfilePage();
                }
            }
        });
    }

    protected addAvatar() {
        this.children.avatar = new Avatar({
            src: this.props.profile.avatarSrc,
            size: "2em",
            alt: this.props.profile.login,
            title: this.props.profile.login
        });
    }

    protected addButton() {
        this.children.addButton = new Icon({
            size: "1.5em",
            icon: this.props.addChatIconSrc
        });
        this.children.addButton.element!.addEventListener("click", (event: MouseEvent) => {
            console.log("Нажата кнопка добавления нового чата");
        });
    }

    protected addSearchInput() {
        this.children.searchInput = new Input({
            title: "Поиск",
            type: "text",
            name: "search",
            value: "",
            placeholder: "Поиск",
            isRounded: true,
            isLight: true,
            displayBlock: true,
            iconSrc: this.props.searchIconSrc
        });
    }

    protected addItemsList() {
        let itemsList: ChatItem[] = [];
        this.testItemsData().forEach((element: ChatItemProps) => {
            itemsList.push(new ChatItem(element));
        });
        this.children.chatItemsList = itemsList;
    }


    private testItemsData():ChatItemProps[] {
        let itemsData: ChatItemProps[] = [];
        let notRead = 0;
        for (let i = 1; i <= 20; i++) {
            let min = Math.ceil(-80);
            let max = Math.floor(80);
            notRead = Math.floor(Math.random() * (max - min + 1)) + min;

            let imageSrc = "";
            if(i < 10) {
                imageSrc = `/upload/img/cat_0${i}.jpg`;
            } else {
                imageSrc = `/upload/img/cat_${i}.jpg`;
            }
            itemsData.push({
                chatId: `${i}`,
                imageSrc: imageSrc,
                name: `Чат с номером ${i}`,
                message: {
                    text: "Случайный текст для проверки отображение его в списке чатов. " +
                        "Случайный текст для проверки отображение его в списке чатов.",
                    dateTime: "20:43",
                },
                notRead: notRead > 0 ? notRead : 0,
                selected: false
            });
        }
        return itemsData;
    }

}