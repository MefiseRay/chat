import Block from '../../utils/Block';
import template from './chat.pug';
import {ChatList, ChatListBase} from './components/ChatList';

import * as chatStyles from './chat.module.scss';
import {ChatItem} from './components/ChatItem';
import {ChatMessages} from './components/ChatMessages';
import ChatsController from "../../controllers/ChatsController";
import {ChatWebSocket} from "../../utils/ChatWebSocket";

export interface ChatProps {
  addChatIconSrc: string,
  searchIconSrc: string,
  menuIconSrc: string,
  attachFileIconSrc: string,
  sendIconSrc: string,
  selected?: string,
  styles?: Record<string, unknown>
}

export class Chat extends Block<ChatProps> {
  constructor(props: ChatProps) {
    super(props);
    this.element!.classList.add(chatStyles.wrapper);
  }

  protected editPropsBeforeMakeThemProxy(props: ChatProps) {
    props.styles = chatStyles;
  }

  protected async init() {
    this._initChatList();
    await this._initChatMessage();
  }

  protected render() {
    return this.compile(template, this.props);
  }

  private _initChatList() {
    delete this.children.chatList;
    this.children.chatList = new ChatList({
      addChatIconSrc: this.props.addChatIconSrc,
      searchIconSrc: this.props.searchIconSrc,
      addCallback: (chatId: string) => this.updateChatList(chatId)
    });
    this._addSelectChatEvents();
  }

  private _addSelectChatEvents() {
    const chatList = (this.children.chatList as ChatListBase).children.chatItemsList;
    if (Array.isArray(chatList)) {
      (chatList as ChatItem[]).forEach((targetChatItem: ChatItem) => {
        targetChatItem.getContent()!.addEventListener('click',  async () => {
          (chatList as ChatItem[]).forEach((item: ChatItem) => {
            item.removeSelection();
          });
          targetChatItem.select();
          await this._initChatMessage(targetChatItem.getPropValue('id'));
        });
      });
    }
  }

  public async deleteChat(chatId: string) {
    await ChatsController.delete(chatId);
    this._initChatList();
    await this._initChatMessage();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  public async updateChatList(chatId: string) {
    await ChatsController.get();
    this._initChatList();
    await this._initChatMessage(chatId);
    const chatList = (this.children.chatList as ChatListBase).children.chatItemsList;
    if (Array.isArray(chatList)) {
      (chatList as ChatItem[]).forEach((targetChatItem: ChatItem) => {
        if(targetChatItem.getPropValue('id') === chatId)
          targetChatItem.select();
      });
    }
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  private async _initChatMessage(chatId?: string) {
    if (chatId) {
      await ChatsController.getSocket(Number(chatId));
    }
    this.children.chatMessages = new ChatMessages({
      chatId,
      menuIconSrc: this.props.menuIconSrc,
      attachFileIconSrc: this.props.attachFileIconSrc,
      sendIconSrc: this.props.sendIconSrc,
      deleteCallback: (chatId: string) => this.deleteChat(chatId)
    });
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }
}
