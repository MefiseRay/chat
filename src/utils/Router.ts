import Block from './Block';

function isEqual(lhs: string, rhs: string): boolean {
  return lhs === rhs;
}

function render(query: string, block: Block<Record<string, any>>) {
  const root = document.querySelector(query);
  if (root === null) {
    throw new Error(`root not found by selector "${query}"`);
  }
  root.innerHTML = '';
  root.append(block.getContent()!);
  return root;
}

class Route {
  private block: Block<{}> | null = null;

  private readonly pathname: string;

  private readonly blockClass: typeof Block<{}>;

  private readonly query: string;

  constructor(
    pathname: string,
    blockClass: typeof Block<{}>,
    query: string,
    private readonly callback?: () => void,
  ) {
    this.pathname = pathname;
    this.blockClass = blockClass;
    this.query = query;
  }

  leave() {
    this.block = null;
  }

  match(pathname: string) {
    return isEqual(pathname, this.pathname);
  }

  render() {
    if (this.callback) {
      this.callback();
    }
    if (!this.block) {
      this.block = new this.blockClass({});
      render(this.query, this.block);
    }
  }
}

class Router {
  private routes: Route[] = [];

  private currentRoute: Route | null = null;

  private history = window.history;

  constructor(private readonly rootQuery: string) {
    this.routes = [];
  }

  public use(pathname: string, block: typeof Block, callback?: () => void) {
    const route = new Route(pathname, block, this.rootQuery, callback);
    this.routes.push(route);
    return this;
  }

  public start() {
    window.onpopstate = (event: PopStateEvent) => {
      const target = event.currentTarget as Window;

      this._onRoute(target.location.pathname);
    };

    this._onRoute(window.location.pathname);
  }

  private _onRoute(pathname: string) {
    const route = this.getRoute(pathname);
    if (!route) {
      return;
    }
    if (this.currentRoute && this.currentRoute !== route) {
      this.currentRoute.leave();
    }
    this.currentRoute = route;
    route.render();
  }

  public go(pathname: string) {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  public back() {
    this.history.back();
  }

  public forward() {
    this.history.forward();
  }

  private getRoute(pathname: string) {
    return this.routes.find((route) => route.match(pathname));
  }
}

export default new Router('#app');
