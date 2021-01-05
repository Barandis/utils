// Copyright (c) 2021 Thomas J. Otterson
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict'

/**
 * Converts a number to its string ordinal form (i.e., `1` becomes
 * `'1st'`, `1729` becomes `'1729th'`, etc.).
 *
 * @param {number} n The number to convert into an ordinal.
 * @returns {string} The same number in its ordinal form.
 */
function ordinal(n) {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (suffixes[(v - 20) % 10] ?? suffixes[v] ?? suffixes[0])
}

/**
 * Converts a number into its word-based ordinal form (i.e., `1` becomes
 * `'first'`, `1729` becomes `'one thousand seven hundred
 * twenty-ninth'`, etc.).
 *
 * @param {number} n The number to convert into an ordinal.
 * @returns {string} The same number in its word-based ordinal form.
 */
function wordinal(n) {
  if (n < 0 || n > Number.MAX_SAFE_INTEGER) {
    throw new Error(`Argument must be between 0 and ${Number.MAX_SAFE_INTEGER}`)
  }

  const nums = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
    'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
    'sixteen', 'seventeen', 'eighteen', 'nineteen',
  ]
  const ones = [
    'zeroth', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh',
    'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth',
    'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth',
    'nineteenth',
  ]
  const tens = [
    'twent', 'thirt', 'fort', 'fift', 'sixt', 'sevent', 'eight', 'ninet',
  ]
  const groups = [
    'hundred', 'thousand', 'million', 'billion', 'trillion', 'quadrillion',
  ]
  const mag = Math.floor(Math.log10(n))

  if (n < 20) return ones[n]
  if (mag === 1) {
    const i = Math.floor(n / 10) - 2
    return n % 10 === 0 ? `${tens[i]}ieth` : `${tens[i]}y-${ones[n % 10]}`
  }
  if (mag === 2) {
    const f = Math.floor(n / 10 ** mag)
    const x = n - f * 10 ** mag
    return `${nums[f]} ${groups[0]}${x === 0 ? 'th' : ` ${wordinal(x)}`}`
  }

  const g = mag % 3 + 1
  const i = Math.floor(mag / 3)
  const f = Math.floor(n / 10 ** (mag - g + 1))
  const m = (function mult(num) {
    if (num < 20) return nums[num]

    const rem = num % 10
    if (num < 100) {
      return `${tens[Math.floor(num / 10) - 2]}y${
        rem === 0 ? '' : `-${nums[rem]}`
      }`
    }

    const x = num - Math.floor(num / 100) * 100
    return `${nums[Math.floor(num / 100)]} ${groups[0]}${
      x === 0 ? 'th' : ` ${mult(x)}`
    }`
  }(f))
  const x = n - f * 10 ** (mag - g + 1)
  return `${m} ${groups[i]}${x === 0 ? 'th' : ` ${wordinal(x)}`}`
}

module.exports = { ordinal, wordinal }
