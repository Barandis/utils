// Copyright (c) 2020 Thomas J. Otterson
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Reduces a collection, returning all of the intermediate reduction values. This is the
 * same as a `reduce` function except that it collects all intermediate results while
 * `reduce` will only return the final result.
 *
 * @param {Iterable<T>} iterable The iterable supplying values to the reducer function.
 * @param {function(U,T):U} reducer The reducer function, taking a result and a value and
 *     returning the two reduced together.
 * @param {U} initial The initial value provided to the reducer function on its first call.
 * @returns {U[]} A collection of all of the values returned by the reducer function. This
 *     array will have one element for each time the reducer function was executed.
 */
export const scan = (iterable, reducer, initial) => {
  const values = []

  Array.from(iterable).reduce((acc, value) => {
    const result = reducer(acc, value)
    values.push(result)
    return result
  }, initial)

  return values
}

/**
 * Takes an iterable of objects and returns an array of all of the values in those objects
 * that are associated with the supplied key.
 *
 * @param {Iterable<object>} iterable
 * @param {symbol|string} key
 * @returns {*[]}
 */
export const pluck = (iterable, key) =>
  Array.from(iterable).reduce((acc, value) => {
    acc.push(value[key])
    return acc
  }, [])
