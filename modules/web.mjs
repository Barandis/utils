// Copyright (c) 2021 Thomas J. Otterson
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const FIRE = Symbol('fire')

const ADOPTED = 'adopted'
const CHANGED = 'changed'
const CONNECTED = 'connected'
const DISCONNECTED = 'disconnected'

/**
 * This function is borne out of my frustration with the decision from the Web Components
 * folks to make it necessary to use classes to make a custom element. In my opinion,
 * there's never a good reason to *force* the use of classes, and classes are something that
 * I choose to use as little as possible.
 *
 * This function creates a custom element in a more functional way. There are basically six
 * parts of a custom element that it has to provide equivalents for.
 *
 * The first is code that would go in the custom element's constructor. This code is simply
 * passed in as the first parameter; `fn` is a function that is executed when the element is
 * created. Within this function, `this` refers to the custom element itself. Helper methdos
 * can also be defined here.
 *
 * The next four are the four custom element lifecycle callbacks. This is accounted for by
 * passing an argument to `fn` when it is called. This argument is an object with three
 * methods:
 *
 * * `on(type, handler)`: registers a handler function to fire each time the callback
 *   associated with the type is called.
 * * `off(type, handler)`: unregisters a handler function from being called each time the
 *   callback associated with the type is called.
 * * `once(type, handler)`: like `on`, except that after it's called the first time it
 *   automatically unregisters itself.
 *
 * The `type` parameter in each function corresponds to one of the lifecycle callbacks:
 *
 * * `connected` is fired each time `connectedCallback()` is called
 * * `disconnected` is fired each time `disconnectedCallback()` is called
 * * `adopted` is fired each time `adoptedCallback()` is called
 * * `changed` is fired each time `attributeChangedCallback(attributeName, oldValue,
 *   newValue)` is called. For this event, the handler will receive an object with
 *   `attributeName`, `oldValue` and `newValue` properties that correspond to the arguments
 *   of the callback.
 *
 * Finally, defining observed attributes is done by simply passing them after `fn`.
 *
 * This function doesn't introduce any new functionality. It's simply a change in coding
 * style.
 *
 * ## Examples
 *
 * This is an example of a standard custom component taken from
 * https://javascript.info/custom-elements with a bit of reformatting.
 *
 * ```
 * class TimeFormatted extends HTMLElement {
 *   render() {
 *     let date = new Date(this.getAttribute('datetime') || Date.now())
 *
 *     this.innerHTML = new Intl.DateTimeFormat("default", {
 *       year: this.getAttribute('year') || undefined,
 *       month: this.getAttribute('month') || undefined,
 *       day: this.getAttribute('day') || undefined,
 *       hour: this.getAttribute('hour') || undefined,
 *       minute: this.getAttribute('minute') || undefined,
 *       second: this.getAttribute('second') || undefined,
 *       timeZoneName: this.getAttribute('time-zone-name') || undefined,
 *     }).format(date)
 *   }
 *
 *   connectedCallback() {
 *     if (!this.rendered) {
 *       this.render()
 *       this.rendered = true
 *     }
 *   }
 *
 *   static get observedAttributes() {
 *     return [
 *       'datetime', 'year', 'month', 'day', 'hour', 'minute', 'second',
 *       'time-zone-name'
 *     ]
 *   }
 *
 *   attributeChangedCallback(name, oldValue, newValue) {
 *     this.render()
 *   }
 * }
 *
 * customElements.define("time-formatted", TimeFormatted)
 * ```
 *
 * This is the equivalent using this function.
 *
 * ```
 * const TimeFormatted = customCompontent(function (emitter) {
 *   const render = () => {
 *     let date = new Date(this.getAttribute('datetime') || Date.now())
 *
 *     this.innerHTML = new Intl.DateTimeFormat("default", {
 *       year: this.getAttribute('year') || undefined,
 *       month: this.getAttribute('month') || undefined,
 *       day: this.getAttribute('day') || undefined,
 *       hour: this.getAttribute('hour') || undefined,
 *       minute: this.getAttribute('minute') || undefined,
 *       second: this.getAttribute('second') || undefined,
 *       timeZoneName: this.getAttribute('time-zone-name') || undefined,
 *     }).format(date)
 *   }
 *
 *   emitter.once('connected', () => render())
 *   emitter.on('changed', () => render())
 * },
 * 'datetime', 'year', 'month', 'day', 'hour', 'minute', 'second',
 *   'time-zone-name')
 *
 * customElements.define("time-formatted", TimeFormatted)
 * ```
 *
 * @param {function} fn A function that is called within the custom element's constructor.
 *     It receives an object as an argument which has `on`, `off`, and `once` properties as
 *     described above. Within this function, `this` is set to the custom element.
 * @param {...string} attributes The attributes that are monitored for changes (and
 *     therefore will fire `changed` events when their values change).
 * @return A class which derived from `HTMLElement` and can be used with
 *     `customElements.define()`.
 */
export default function customElement(fn, ...attributes) {
  const attr = attributes.slice()

  class CustomElement extends HTMLElement {
    constructor() {
      super()

      const emitter = function emitter() {
        const events = new Map()
        const onces = new WeakMap()

        const getEvents = type => events.get(type) ?? new Set()

        this[FIRE] = ({ type, ...payload }) => {
          ;[...getEvents(type).values()].forEach(handler => handler(payload))
        }

        return {
          on(type, handler) {
            events.set(type, getEvents(type).add(handler))
          },

          off(type, handler) {
            getEvents(type).delete(onces.get(handler) ?? handler)
          },

          once(type, handler) {
            const wrapped = (...args) => {
              handler(...args)
              this.off(type, wrapped)
            }
            onces.set(handler, wrapped)
            this.on(type, wrapped)
          },
        }
      }.call(this)

      fn.call(this, emitter)
    }

    static get observedAttributes() {
      return attr
    }

    adoptedCallback() {
      this[FIRE]({ type: ADOPTED })
    }

    attributeChangedCallback(attributeName, oldValue, newValue) {
      this[FIRE]({ type: CHANGED, attributeName, newValue, oldValue })
    }

    connectedCallback() {
      this[FIRE]({ type: CONNECTED })
    }

    disconnectedCallback() {
      this[FIRE]({ type: DISCONNECTED })
    }
  }

  return CustomElement
}
