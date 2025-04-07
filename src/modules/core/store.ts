import { diff } from '../object';
import { createUUID } from '../uuid';

interface SubscribeOptions {
  initialize?: boolean;
}

export default class Store<T> {
  private _states: T[];
  private _observers: {
    [key: string]: (state: T, diffStates: (keyof T)[]) => void;
  };
  private _hasStateInit: boolean;

  constructor() {
    this._states = [] as T[];
    this._observers = {};
    this._hasStateInit = false;
  }

  get state() {
    return { ...this._states[this._states.length - 1] };
  }

  set state(newState: T) {
    if (!this._hasStateInit) {
      this._states.push(Object.freeze(newState));
      this._hasStateInit = true;
      return;
    }
    this.set(newState);
  }

  private runObserver(key: string, diffStates: (keyof T)[]) {
    this._observers[key](this._states[this._states.length - 1], diffStates);
  }

  async set<K extends keyof T>(nextState: Pick<T, K>): Promise<T> {
    if (!this._hasStateInit) {
      this._hasStateInit = true;
    }

    return new Promise((resolve) => {
      this.beforeStateChange();

      let newState: any = nextState;
      const prevState = this._states[this._states.length - 1];

      newState = Object.freeze({
        ...prevState,
        ...newState,
      });

      const diffStates = diff(prevState, newState) as (keyof T)[];

      this._states.push(newState);
      this._states.shift();

      Promise.all(
        Object.keys(this._observers).map((key) => {
          return new Promise((_resolve) => {
            try {
              this.runObserver(key, diffStates);
            } catch {
              this.unsubscribe(key);
            }
            _resolve(true);
          });
        })
      ).then(() => {
        this.afterStateChange();
        resolve(newState);
      });
    });
  }

  beforeStateChange() {}

  afterStateChange() {}

  subscribe(fn: (state: T, diffStates: (keyof T)[]) => void, options?: SubscribeOptions) {
    if (options?.initialize) {
      fn(this.state, Object.keys(this.state as object) as (keyof T)[]);
    }

    const key = createUUID();
    this._observers[key] = fn;
    return key;
  }

  unsubscribe(key: string) {
    delete this._observers[key];
  }
}

export function createStore<T>(initialState: T) {
  const store = new Store<T>();
  store.state = initialState;
  return store;
}
