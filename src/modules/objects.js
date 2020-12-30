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
 * `trackedFactory`). This method is a function that takes any object
 * and returns a boolean indicating whether the factory function created
 * the object. These objects are weakly stored for lookup, meaning that
 * the storage will not interfere with them being garbage collected if
 * all other references to them are eliminated.
 *
 * The factory must produce an object, not a primitive value, as only
 * objects can be weakly stored in this way.
 *
 * ### Examples
 * ```
 * const createObject = trackedFactory(prop => ({ prop }))
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
 * const createObject = trackedFactory(prop => ({ prop }))
 * const createAugmented = trackedFactory((prop, other) => ({
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
 * @param {function} fn - a factory function that takes any number of
 *     arguments and returns an object
 * @param {string} [prop='created'] - the name of the property added to
 *     the provided factory function. This property is a function that
 *     takes an object and returns `true` if the factory function
 *     created the object or `false` if it didn't.
 * @returns {function} - the same factory function, augmented with the
 *     tracking method.
 */
export function trackedFactory(fn, prop = 'created') {
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
 * then use that solution and not this one. This implementation only
 * calls `Object.freeze(this)` within the constructor of the class that
 * has `new` put in front of it, so parent class constructors will not
 * call it and only the final child class constructor will.
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
 * @param {typeof Class} Class
 * @returns {typeof Class}
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

export function nullClass() {
  class NullClass {}
  Object.setPrototypeOf(NullClass.prototype, null)
  return NullClass
}
