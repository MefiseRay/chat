import {nanoid} from 'nanoid';
import {EventBus} from './EventBus';
import refElementsCollection from './RefElementsCollection';

// Нельзя создавать экземпляр данного класса
class Block<T extends Record<string, any>> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  };

  public readonly id = nanoid(6); // идентификатор блока

  protected props: Record<string, any>; // параметры для блока

  public children: Record<string, Block<Record<string, any>> | Block<Record<string, any>>[]>; // вложенные блоки

  protected eventBus: () => EventBus; // EventBus для событий

  private _element: HTMLElement | null = null;

  protected readonly _meta: { tagName: string; props: any; };

  /** JSDoc
   * конструктор
   * @param {string} tagName
   * @param {Object} propsWithChildren
   *
   * @returns {void}
   */
  constructor(propsWithChildren: T = {} as T, tagName: string = 'div') {
    this._getChildrenAndProps = this._getChildrenAndProps.bind(this);
    // создаем объект EventBus
    const eventBus = new EventBus();
    // поулчаем набор характеристик и дочерних элементов
    const {props, children} = this._getChildrenAndProps(propsWithChildren);
    this._meta = {
      tagName,
      props,
    };
    // задаем дочерние элементы
    this.children = children;
    // делаем характеристики отслеживаемыми через Прокси
    this.props = this._makePropsProxy(props);
    this.eventBus = () => eventBus;
    this._registerEvents(eventBus);
    // вызываем событие на INIT
    eventBus.emit(Block.EVENTS.INIT);
  }

  /*eslint-disable */
  protected editPropsBeforeMakeThemProxy(props: Record<string, any>) {
  }

  /* eslint-enable */

  /** JSDoc
   * получаем разделеныне характеристики и дочерние элементы
   * @param {Record<string, unknown>} childrenAndProps
   * @returns {{ props: Record<string, unknown>, children:Record<string, Block | Block[]> }}
   * @private
   */
  private _getChildrenAndProps(childrenAndProps: Record<string, unknown>):
    { props: Record<string, unknown>, children: Record<string, Block<Record<string, any>> | Block<Record<string, any>>[]> } {
    // создаем набор характеристик
    const props: Record<string, unknown> = {};
    // создаем набор дочерних элементов
    const children: Record<string, Block<Record<string, any>> | Block<Record<string, any>>[]> = {};
    Object.entries(childrenAndProps).forEach(([key, value]) => {
      if (Array.isArray(value) && value.every((v) => v instanceof Block)) {
        children[key] = value;
      } else if (value instanceof Block) {
        // если значение является объектом Block то его добавляем в дочерние элементы
        children[key] = value;
      } else {
        // иначе добавляем его в характеристики
        props[key] = value;
      }
    });
    // возвращаем кортеж характеристик и дочерних элементов
    return {props, children};
  }

  /** JSDoc
   * Делаем пропсы отслеживаемыми и защищаем приватыне пропсы
   * @param {Record<string, any>} props
   * @returns {Record<string, any>}
   * @private
   */
  private _makePropsProxy(props: Record<string, any>): Record<string, any> {
    const self = this;
    this.editPropsBeforeMakeThemProxy(props);
    return new Proxy(props, {
      get(target: Record<string, any>, prop: string) {
        if (prop.startsWith('_')) throw new Error('Ошибка обращения к приватной характеристике');
        const value = target[prop];
        // при поулчении характеристики если она является функцией прокидываем в нее target
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target: Record<string, any>, prop: string, value) {
        if (prop.startsWith('_')) throw new Error('Ошибка перезаписи приватной характеристики');
        const oldTarget = {...target};
        target[prop] = value;
        // Запускаем событие обнволения и передаем старые параметры и новые
        self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget, target);
        return true;
      },
      deleteProperty() {
        throw new Error('Нельзя удалять характеристики');
      },
    });
  }

  /** JSDoc
   * Инициируем колбеки на события
   * @param {EventBus} eventBus
   * @returns {void}
   * @private
   */
  private _registerEvents(eventBus: EventBus): void {
    eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  // INIT елемента

  /** JSDoc
   * Инициируем елемента
   * @returns {void}
   * @private
   */
  private _init(): void {
    this._createResources();
    this.init();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  /** JSDoc
   * Созадем освноной элемент по тегу
   * @private
   */
  private _createResources() {
    const {tagName} = this._meta;
    this._element = this._createDocumentElement(tagName);
  }

  /** JSDoc
   * @param {string} tagName
   * @returns {HTMLElement}
   * @private
   */
  private _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  /** JSDoc
   * @param {string[]} tagNameList
   * @returns {HTMLElement[]}
   * @private
   */
  private _createDocumentElementsList(tagNameList: string[]): HTMLElement[] {
    return tagNameList.reduce<HTMLElement[]>(
      (elementList: HTMLElement[], currentTag: string) => [
        ...elementList, this._createDocumentElement(currentTag),
      ],
      [],
    );
  }

  /*eslint-disable */
  protected init() {
  }

  /* eslint-enable */

  // RENDER елемента

  private _render() {
    const fragment = this.render();
    refElementsCollection.setElementsCollection(fragment, this.id);
    this._element!.innerHTML = '';
    this._element!.append(fragment);
    this._addEvents();
    this.afterRender();
  }

  protected render(): DocumentFragment {
    return new DocumentFragment();
  }

  /*eslint-disable */
  protected afterRender(): void {
  }

  /* eslint-enable */

  private _addEvents() {
    // поулчаем из props запись по ключу events которое является Record<string, () => void>
    const {events = {}} = this.props as { events: Record<string, () => void> };
    // перебираем все значения events и добавляем EventListener
    Object.keys(events).forEach((eventName) => {
      this._element?.addEventListener(eventName, events[eventName]);
    });
  }

  // COMPONENT DID MOUNT

  _componentDidMount(): void {
    this.componentDidMount();
  }

  /*eslint-disable */
  public componentDidMount(): void {
  }

  /* eslint-enable */

  /**
   * вызываем когда нам надо подмонтировать компонет
   */
  public dispatchComponentDidMount(): void {
    // вызываем событие на монтирвоание компонента
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    // для всех дочерних элементов вызываем также монтирвоание
    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((childEl) => {
          childEl.dispatchComponentDidMount();
        });
      } else {
        child.dispatchComponentDidMount();
      }
    });
  }

  // COMPONENT DID UPDATE

  private _componentDidUpdate(
    oldProps: Record<string, unknown>,
    newProps: Record<string, unknown>,
  ): void {
    if (this.componentDidUpdate(oldProps, newProps)) {
      // вызываем событие для перерисовки
      this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  /* eslint-disable */
  protected componentDidUpdate(
    oldProps: Record<string, unknown>,
    newProps: Record<string, unknown>,
  ): boolean {
    return true;
  }

  /* eslint-enable */
  // Другое

  public setProps = (nextProps: Record<string, unknown>) => {
    if (!nextProps) {
      return;
    }
    Object.assign(this.props, nextProps);
  };

  public setProp = (prop: string, value: unknown) => {
    const newValue = value;
    if (!this.props[prop]) {
      return;
    }
    this.props[prop] = newValue;
  };

  public getPropValue(prop: string): any {
    if (!this.props[prop]) {
      return null;
    }
    return this.props[prop];
  }

  get element(): HTMLElement | null {
    return this._element;
  }

  protected compile(template: (context: any) => string, context: any) {
    const contextAndStubs = {...context};
    Object.entries(this.children).forEach(([name, component]) => {
      if (Array.isArray(component)) {
        const componentList: string[] = [];
        component.forEach((element) => {
          componentList.push(`<div data-id="${element.id}"></div>`);
          contextAndStubs[name] = `<div data-id="${element.id}"></div>`;
        });
        contextAndStubs[name] = componentList;
      } else {
        contextAndStubs[name] = `<div data-id="${component.id}"></div>`;
      }
    });
    const html = template(contextAndStubs);
    const temp = document.createElement('template');
    temp.innerHTML = html;
    /* eslint-disable */
    Object.entries(this.children).forEach(([_, component]) => {
      /* eslint-enable */
      if (Array.isArray(component)) {
        component.forEach((element) => {
          const stub = temp.content.querySelector(`[data-id="${element.id}"]`);
          if (!stub) {
            return;
          }
          element.getContent()?.append(...Array.from(stub.childNodes));
          stub.replaceWith(element.getContent()!);
        });
      } else {
        const stub = temp.content.querySelector(`[data-id="${component.id}"]`);
        if (!stub) {
          return;
        }
        component.getContent()?.append(...Array.from(stub.childNodes));
        stub.replaceWith(component.getContent()!);
      }
    });
    return temp.content;
  }

  public getContent() {
    return this.element;
  }

  public show() {
    this.getContent()!.style.display = 'block';
  }

  public hide() {
    this.getContent()!.style.display = 'none';
  }
}

export default Block;
