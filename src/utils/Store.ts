import { isEqual, set } from './Helpers';
import { EventBus } from './EventBus';
import Block from './Block';
import { User } from '../api/UsersAPI';
import { ChatsData } from '../api/ChatsAPI';
import { ChatMessagesList } from '../modules/Chat/components/ChatMessage';

export enum StoreEvents {
  Updated = 'updated'
}

type State = {
  user?: User
  chats?: ChatsData
  messages?: ChatMessagesList
};

export class Store extends EventBus {
  private state: State = {};

  public set(keyPath: string, data: unknown, rewrite = false) {
    set(this.state, keyPath, data, rewrite);
    this.emit(StoreEvents.Updated, this.getState());
  }

  public getState() {
    return this.state;
  }
}

const store = new Store();

export function withStore<SP extends Record<string, any>>(mapStateToProps: (state: State) => SP) {
  return function wrap<P extends Record<string, any>>(Component: typeof Block<P & SP>) {
    let previousState: SP;
    return class WithStore extends Component {
      constructor(props: P) {
        previousState = mapStateToProps(store.getState());
        super({ ...props, ...previousState });
        store.on(StoreEvents.Updated, () => {
          const stateProps = mapStateToProps(store.getState());
          if (!isEqual(previousState, stateProps)) {
            previousState = stateProps;
            this.setProps({ ...stateProps });
          }
        });
      }
    };
  };
}

export default store;
