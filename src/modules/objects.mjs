// Copyright (c) 2020 Thomas J. Otterson
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const identifier = /^[$_\p{ID_Start}][$_\u200c\u200d\p{ID_Continue}]*$/u

/**
 * Consumes a factory function and returns a version of that same
 * function that keeps track of objects that it has created.
 *
 * The provided factory function is augmented with a `created` method
 * (the name can be changed by providing a second argument to
 * `tracked`). This method is a function that takes any object and
 * returns a boolean indicating whether the factory function created the
 * object. These objects are weakly stored for lookup, meaning that the
 * storage will not interfere with them being garbage collected if all
 * other references to them are eliminated.
 *
 * The factory must produce an object, not a primitive value, as only
 * objects can be weakly stored in this way.
 *
 * ### Examples
 * ```
 * const createObject = tracked(prop => ({ prop }))
 *
 * const tracked = createObject(42) // { prop: 42 }
 * const untracked = { prop: 42 }   // also { prop: 42 }
 *
 * createObject.created(tracked)    // true
 * createObject.created(untracked)  // false
 * ```
 * If a factory is used that returns objects augments an object returned
 * in turn by another factory, `created` will return `true` from both
 * factories.
 * ```
 * const createObject = tracked(prop => ({ prop }))
 * const createAugmented = tracked((prop, other) => ({
 *   ...createObject(prop),
 *   other,
 * }))
 *
 * const regular = createObject(42)
 * const augmented = createAugmented(23, 17)
 *
 * createObject.created(regular)      // true
 * createAugmented.created(regular)   // false
 * createObject.created(augmented)    // true
 * createAugmented.created(augmented) // true
 * ```
 *
 * @param {function(...*):object} fn - a factory function that takes any
 *     number of arguments and returns an object
 * @param {string} [prop='created'] - the name of the property added to
 *     the provided factory function. This property is a function that
 *     takes an object and returns `true` if the factory function
 *     created the object or `false` if it didn't.
 * @returns {function(...*):object} - the same factory function,
 *     augmented with the tracking method.
 */
export function tracked(fn, prop = 'created') {
  const creations = new WeakSet()

  return Object.defineProperty(
    (...args) => {
      const created = fn(...args)
      creations.add(created)
      return created
    },
    prop,
    { value: creations.has.bind(creations) },
  )
}

/**
 * Creates a new, frozen class based on the original class passed into
 * the function.
 *
 * This rather convoluted implementation solves two problems in a more
 * naive, "just put `Object.freeze(this) at the end of the constructor"
 * implementation.
 *
 * The first is that simply inserting `Object.freeze(this)` at the end
 * of the constructor means that properties can no longer be added to
 * the class, including by a sub-class. If that is the desired behavior,
 * then use `final` instead (because that's exactly what `final` does).
 * This implementation only calls `Object.freeze(this)` within the
 * constructor of the class that has `new` put in front of it, so parent
 * class constructors will not call it and only the final child class
 * constructor will.
 *
 * The second problem is that of error messages. Since the class that
 * this function returns is actually a subclass of the one passed in,
 * error messages (that come from, for example, trying to assign new
 * values to the frozen class's properties) will reference this new,
 * presumably inconveniently named class. I have yet to find a good way
 * to assign the original class's name to this new frozen class. That
 * being the case, `eval` is used here to produce a string with the
 * correct class name that is then executed.
 *
 * Yes, of course `eval` is bad, but this is a very controlled setting
 * where the `eval`ed string is encapsulated within the function itself.
 * The only part of it that is allowed in from the outside is the `name`
 * property of the input class, but that name is rejected and the
 * generic name `Frozen` used instead of someone injects some string
 * into the class's `name` property that is not a legal JavaScript
 * identifier. Just take care if you go changing things that you don't
 * break the security with `eval`.
 *
 * @param {typeof Class} Class The class to be frozen.
 * @returns {typeof Class} A version of the class whose properties
 *     cannot be changed.
 */
export function frozen(Class) {
  const name = identifier.test(Class.name) ? Class.name : 'Frozen'

  return eval(`Class => class ${name} extends Class {
    constructor(...args) {
      super(...args)
      if (new.target === ${name}) {
        Object.freeze(this)
      }
    }
  }`)(Class)
}

/**
 * Creates a new, final class based on the original class passed into
 * the function.
 *
 * This function is very much like `frozen`, except that it also does
 * not allow properties to be added through class extension. All other
 * bits of reasoning (in particular, using `eval` so that the class's
 * name will be right) and explanations of the use of `eval` are the
 * same.
 *
 * Note that this does not prevent the creation of derived classes. It
 * simply disallows instantiated *objects* from changing anything. Even
 * a class that adds properties can still be defined; it'll simply throw
 * an error when an attempt is made to instantiate it.
 *
 * @param {typeof Class} Class The class to be finalized.
 * @returns {typeof Class} A version of the class whose properties
 *     cannot be changed, including via class extension.
 */
export function final(Class) {
  const name = identifier.test(Class.name) ? Class.name : 'Final'

  return eval(`Class => class ${name} extends Class {
    constructor(...args) {
      super(...args)
      Object.freeze(this)
    }
  }`)(Class)
}

/**
 * A class without a prototype. This is essentially the class equivalent
 * of `Object.create(null)`. If extended, the child class will not have
 * the normal `Object` properties (`toString`, `keys`, etc.).
 */
export class NullClass {}
Object.setPrototypeOf(NullClass.prototype, null)

/**
 * An object that represents nothing, except in a way that has some
 * advantages over `null` and `undefined`.
 *
 * This object has only four properties, none of which are enumerable
 * (i.e., they won't show up if you do a `for (const prop in Nothing)`
 * or an `Object.keys(Nothing)` or similar). These properties are meant
 * to be called only by the engine and not by a user, with the possible
 * exception of `toString`, which returns the string `"Nothing"`.
 *
 * If any `other` property is accessed, it will return `Nothing`.
 * `Nothing` can also be called like a function; predictably, it returns
 * `Nothing` no matter what arguments are passed in.
 *
 * The end result is a value that can be chained either through property
 * access or function invocation and still result ultimately in
 * `Nothing`. This isn't dissimilar to the optional chaining syntax, but
 * it doesn't require a different syntax to work.
 *
 * ### Example
 *
 * ```javascript
 * const start = Nothing
 * const result = start.a.b[2].map(x => x + 1)[''](1)(5).x().y
 * console.log(result)  // Nothing
 * ```
 */
export const Nothing = (() => {
  const fn = () => Nothing
  const props = {
    toString: () => 'Nothing',
    toLocaleString: () => 'Nothing',
    valueOf: () => undefined,
    [Symbol.toPrimitive]: () => undefined,
  }

  return new Proxy(Object.freeze(fn), {
    get: (_, k) => Object.hasOwnProperty.call(props, k) ? props[k] : Nothing,
  })
})()
