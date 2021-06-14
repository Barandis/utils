// Copyright (c) 2020 Thomas J. Otterson
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Produces a curried function out of a regular function.
 *
 * This curried function is quite flexible. If it is called with the same number of
 * arguments as the original function, then it will simply execute the original function.
 *
 * However, if it is called with fewer arguments, it will return a function that takes only
 * the *remaining* arguments and still produces the same result. The returned function is
 * itself curried, so this process can be done again.
 *
 * This currying function requires that its original function specify its arguments. It will
 * not work on functions that use `arguments` to determine its arguments or that use rest
 * parameters.
 *
 * ### Examples
 *
 * ```javascript
 * const sum = curry((a, b, c) => a + b + c)
 *
 * // Each of the following are equivalent, and all return 6.
 * sum(1, 2, 3)
 * sum(1, 2)(3)
 * sum(1)(2, 3)
 * sum()(1, 2, 3)
 * sum(1)(2)(3)
 * ```
 *
 * @param {function} fn A function of any number of arguments.
 * @returns {function} A function that, if called with fewer arguments than specified in
 *     `fn`, returns another function that takes the *rest* of the arguments.
 */
export const curry = fn =>
  function curried(...args) {
    return args.length >= fn.length ? fn(...args) : (...rest) => curried(...args, ...rest)
  }

/**
 * Produces a curried function out of a regular function.
 *
 * This function is the same as `curry` above, but it's implemented in a much sillier way.
 *
 * When I wrote `curry`, I was mildly annoyed because it required using a recursive
 * function. I love recursive functions, but in JavaScript you can't make an inline arrow
 * function recursive because there's no way to give it a name. That meant that the best way
 * to implement it was to use `function` so that I could give this recursive function a
 * name, and that meant using the `return` keyword instead of the convenient arrow function
 * implied return.
 *
 * None of this is bad. I just think it's ugly, and for me, that's motivation enough to look
 * for another way. Fortunately I've been playing around with the other way for several
 * years so it was quickly clear to me what I wanted to do.
 *
 * The Y-combinator is one of the niftiest things in all of programming. It is a function
 * that takes a properly-formed function and makes it act recursive without actually
 * requiring it to *be* recursive. This would mean no need for a named function, which would
 * mean no need for `function` or `return`, and my dream of a one-line `curry` function
 * could be realized.
 *
 * To properly form a recursive function for use with the Y-combinator, you basically just
 * need to abstract out the recursive call, making that function a parameter of the function
 * instead. In other words, this recursive function
 *
 * ```javascript
 * function curried(...args) {
 *   return args.length >= fn.length
 *     ? fn(...args)
 *     : (...rest) => curried(...args, ...rest)
 * ```
 *
 * would turn into this non-recursive function
 *
 * ```
 * (rfn, ...args) =>
 *   args.length >= fn.length)
 *     ? fn(...args)
 *     : (...rest) => cfn(...args, ...rest)
 * ```
 *
 * and get passed directly into the Y-combinator to do exactly the same thing as the
 * original recursive function.
 *
 * The Y-combinator being used here isn't, strictly speaking, the "real" Y-combinator.
 * That's because of two sometimes-annoying properties of the Y-combinator:
 *
 * 1. It takes a single-parameter function as its argument
 * 2. It blows up the stack in non-lazy languages.
 *
 * The function used here is a derivative that allows multi-parameter functions and works
 * with non-lazy languages like JavaScript. Otherwise it does exactly the same thing.
 *
 * Note that, of course, I could assign the Y-combinator itself to a variable and make the
 * whole thing easier to read. But the point wasn't to make it easy to read, it was to make
 * it a one-liner. I may have broken that one-liner up into three lines here because of its
 * length, but make no mistake, it's a one-liner.
 *
 * This was done just for fun, and to see what it was like to write a three-line function
 * that uses seven arrows and seven spread operators. It's convoluted and inefficient and
 * only serves to prove a point (which is probably just that "I don't have to use named
 * function expressions if I don't wanna"). Please don't actually use it.
 *
 * @deprecated Please use `curry` instead...UNLESS YOU LIKE FUN.
 * @param {function} fn A function of any number of arguments.
 * @returns {function} A function that, if called with fewer arguments than specified in
 *     `fn`, returns another function that takes the *rest* of the arguments.
 */
export const curryY = fn =>
  (f =>
    (x => x(x))(
      m =>
        (...a) =>
          f(m(m), ...a),
    ))((rfn, ...args) =>
    args.length >= fn.length ? fn(...args) : (...rest) => rfn(...args, ...rest),
  )

/**
 * Accepts a curried function and reverses the order of two sets of parameters of that
 * function.
 *
 * ```javascript
 * const map = (iter, fn) => Array.from(iter).map(fn)
 * const curried = curry(map)
 * const flipped = flip(curried)
 *
 * console.log(curried([1, 2, 3])(x => x + 1))     // [2,3,4]
 * console.log(flipped(x => x + 1)([1, 2, 3])) // [2,3,4]
 * ```
 *
 * This function will flip two sets of parameters, no matter how many parameters are in each
 * set. The order of the parameters within each set is not changed.
 *
 * ```javascript
 * const reduce = (iter, fn, init) => Array.from(iter).reduce(fn, init)
 * const curried = curry(reduce)
 * const flipped = flip(curried)
 *
 * console.log(curried([1, 2, 3])((a, b) => a + b, 0)) // 6
 * console.log(flipped((a, b) => a + b, 0)([1, 2, 3])) // 6
 * ```
 *
 * Flipping parameters is often useful because many JavaScript functions have parameters in
 * a data-first order. This is a problem when composing functions because composition
 * requires that the data argument be last.
 *
 * @param {function} fn A curried function whose two sets of parameters should be reversed
 *     in order.
 * @returns {function} A curried function of two parameter sets whose sets are in reverse
 *     order of the original function.
 */
export const flip =
  fn =>
  (...a) =>
  (...b) =>
    fn(...b)(...a)

/**
 * Combines two or more single-parameter functions into one single-parameter function that
 * passes the results from its contained functions to the next and returns the result of the
 * last contained function.
 *
 * The order of the functions is reversed, as is traditional in functional programming.
 *
 * @param {...function} fns The functions that should be composed into a single function.
 * @returns {function} A single function that is the composition of all of the provided
 *     functions.
 */
export const compose =
  (...fns) =>
  x =>
    fns.reduceRight((y, f) => f(y), x)

/**
 * Combines two or more single-parameter functions into one single-parameter function that
 * passes the results from its contained functions to the next and returns the result of the
 * last contained function.
 *
 * The order of the functions is *not* reversed. The first function listed is the first
 * applied. This is contrary to the order most often used in functional programming (and
 * opposite of the order in `compose`), but there are times when the piped order makes more
 * sense than the composed order.
 *
 * @param {...function} fns The functions that should be composed into a single function.
 * @returns {function} A single function that is the composition of all of the provided
 *     functions, but with the order of execution reversed..
 */
export const pipe =
  (...fns) =>
  x =>
    fns.reduce((y, f) => f(y), x)
