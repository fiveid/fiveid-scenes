interface IState {
  currentIndex: number;
  nextIndex?: number;
  prevIndex?: number;
}

interface IOptions {
  activeClass: string;
  dataKey: string;
  initialIndex: number;
  preTransition: (
    state: IState,
    callback: (nextIndex?: number) => void,
    evt?: any
  ) => void;
  postTransition: (state: IState, evt?: any) => void;
}

interface ISelectors {
  scene: string;
  next: string;
  prev: string;
  reset: string;
  goto: string;
  pop: string;
}

interface IConfig extends Partial<IOptions> {
  selectors?: Partial<ISelectors>;
}

export class Scenes {
  options: IOptions;
  selectors: ISelectors;
  activeIndex: number;
  history: number[];
  scenes: NodeListOf<Element>;

  constructor({ selectors = {}, ...options }: IConfig = {}) {
    this.options = {
      activeClass: "active",
      dataKey: "sceneIndex",
      initialIndex: 0,
      preTransition: (_, cb) => cb(),
      postTransition: () => null,
      ...options
    };

    this.selectors = {
      scene: ".scene",
      next: ".scene__next",
      prev: ".scene__prev",
      reset: ".scene__reset",
      goto: ".scene__goto",
      pop: ".scene__pop",
      ...selectors
    };

    this.activeIndex = this.options.initialIndex || 0;
    this.history = [this.activeIndex];
    this.scenes = document.querySelectorAll(this.selectors.scene);

    this.init();
  }

  transitionTo(index = 0, evt = {}) {
    this.options.preTransition(
      { currentIndex: this.activeIndex, nextIndex: index },
      nextIndex => {
        const prev = this.activeIndex;
        const next = this.validateTransitionValues(nextIndex || index);
        this.scenes[prev].classList.remove(this.options.activeClass);
        this.scenes[next].classList.add(this.options.activeClass);
        this.activeIndex = next;
        this.history.push(next);
        this.options.postTransition(
          { currentIndex: this.activeIndex, prevIndex: prev },
          evt
        );
      },
      evt
    );
  }

  private init() {
    this.setupEvents();
  }

  private validateTransitionValues(to, fallback = 0) {
    if (to === null || to === undefined) {
      return fallback;
    }
    const min = 0;
    const max = this.scenes.length - 1;
    to = to < min ? min : to > max ? max : to;
    return to;
  }

  private setupEvents() {
    const getDataTargetIndex = dataset =>
      dataset &&
      dataset[this.options.dataKey] &&
      Number(dataset[this.options.dataKey]);

    const transitionOnClick = nextIndex => (el, i) =>
      el.addEventListener("click", evt => {
        this.transitionTo(nextIndex(el, i), evt);
      });

    const addListeners = (selector, fn) =>
      document.querySelectorAll(selector).forEach(fn);

    const events = [
      [this.selectors.next, () => this.activeIndex + 1],
      [this.selectors.prev, () => this.activeIndex - 1],
      [this.selectors.reset, () => this.options.initialIndex],
      [this.selectors.goto, el => getDataTargetIndex(el.dataset)],
      [
        this.selectors.pop,
        () => {
          if (this.history.length >= 1) {
            this.history.pop();
            return this.history[this.history.length - 1];
          }
          return this.options.initialIndex;
        }
      ]
    ];

    events.forEach(([selector, fn]) =>
      addListeners(selector, transitionOnClick(fn))
    );
  }
}
