# Scenes

Minimalist scene-switcher module in vanilla JS.

## Basic usage

`Scenes` toggles the `active` classname of elements. In the simple example below, clicking the "Next" or "Previous" buttons will switch visibility between the two scenes.

- `index.html`

```html
<div class="scene active">
  <p>This is scene 1</p>
  <button class="scene__next">Next</button>
</div>
<div class="scene">
  <p>This is scene 2</p>
  <button class="scene__prev">Previous</button>
</div>
```

- `style.css`

```css
.scene {
  display: none;
}

.scene {
  display: block;
}
```

- `main.js`

```js
import { Scenes } from "@fiveid/scenes";

const scenes = new Scenes();
```

## Options

Customise Scenes behaviour by passing an options object on initialisation.

| Option key       | Description                                                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `selectors`      | An object containing the DOM selectors that trigger certain actions (see below)                                                  |
| `activeClass`    | The classname that designates a scene element as "active" (default: `active`)                                                    |
| `dataKey`        | The HTML data attribute used to identify which scene index to set as active, in JS format (default: `sceneIndex`)                |
| `initialIndex`   | The index of the active scene on load (default: `0`)                                                                             |
| `preTransition`  | A function that is called before changing active state. This can be used to alter the next active scene (see full example below) |
| `postTransition` | A function that is called after changing active state (see full example below)                                                   |

### Selectors

Override default DOM selectors in options.

State changes are triggered when users click on DOM elements. The selectors that trigger these actions can be configured (or you can keep the default values).

| Key   | Description                                                                                      | Default         |
| ----- | ------------------------------------------------------------------------------------------------ | --------------- |
| scene | The element that will be set as active or not                                                    | `.scene`        |
| next  | Sets the subsequent adjacent scene element to active                                             | `.scene__next`  |
| prev  | Sets the previous adjacent scene element to active                                               | `.scene_prev`   |
| reset | Sets the scene element at the initial index to active                                            | `.scene__reset` |
| goto  | Goes to a scene element at an index specified by a HTML data attribute (e.g. `data-scene-index`) | `.scene__goto`  |
| pop   | Sets the previously active scene element as active                                               | `.scene__pop`   |

Example custom selectors:

```js
const mySelectors = {
  scene: ".block",
  next: ".block__next",
  prev: ".block__prev",
  reset: ".block__reset",
  goto: ".block__goto",
  pop: ".block__pop"
};
```

### Pre-transition

You can trigger a side effect or alter the typical state change behaviour by passing a function to the `preTransition` option.

The function has three parameters:

- **state:** an object containing `currentIndex` and `nextIndex`
- **callback:** a function that needs to be called to trigger the state change. You can optionally pass a `nextIndex` value to the callback to determine which scene will next be set as active
- **event:** if the transition was triggered by a JS event, the event object will be passed to the preTransition function

Example:

```js
const preTransition = (state, callback, event) => {
  if (
    state.nextIndex === RESTRICTED_SCENE &&
    userIsAllowedRestrictedScene === false
  ) {
    return callback(state.currentIndex);
  }

  callback();
};
```

### Post-transition

You can trigger a side effect after changing active state by passing a function to the `postTransition` option.

The function has two parameters:

- **state:** an object containing `currentIndex` and `prevIndex`
- **event:** if the transition was triggered by a JS event, the event object will be passed to the preTransition function

Example:

```js
const postTransition = (state, event) => {
  lazyLoadContentOfActiveScene(state.currentIndex);
  disableMediaContentOfPreviousScene(state.prevIndex);
};
```

## Instance properties and methods

Some potentially useful instance methods and properties are exposed.

### `activeIndex`

The index of the currently active scene.

Returns:

- `: number`

### `transitionTo`

A function that sets the scene at `index` as active. (Note: calling `transitionTo` will still trigger the `preTransition` and `postTransition` functions).

Parameters:

- `index: number` - the target scene index (default: `0`)

Example:

```js
const scenes = new Scenes();

fetchDataFromSomewhere().then(done => {
  if (done.ok) {
    scenes.transitionTo(1); // success scene
  } else {
    scenes.transitionTo(2); // error scene
  }
});
```
