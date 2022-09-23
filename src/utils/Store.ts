import {set} from './Helpers';
import {EventBus} from './EventBus';
import Block from './Block';
import {User} from "../api/UsersAPI";

export enum StoreEvents {
  Updated = 'updated'
}

type State = {
  user?: User
  selectedChat?: string
};

export class Store extends EventBus {
  private state: State = {};

  public set(keyPath: string, data: unknown) {
    set(this.state, keyPath, data);
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
        super({...props, ...previousState});
        store.on(StoreEvents.Updated, () => {
          const stateProps = mapStateToProps(store.getState());
          previousState = stateProps;
          this.setProps({...stateProps});
        });
      }
    }
  }
}

export default store;