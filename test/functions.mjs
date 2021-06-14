// Copyright (c) 2020 Thomas J. Otterson
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { expect } from 'chai'
import { compose, curry, curryY, flip, pipe } from '../modules/functions.mjs'
import { range } from '../modules/iterators.mjs'

const map = (iterable, fn) => Array.from(iterable).map(fn)
const filter = (iterable, fn) => Array.from(iterable).filter(fn)
const take = (iterable, n) => Array.from(iterable).slice(0, n)
const reduce = (iterable, fn, init) => Array.from(iterable).reduce(fn, init)

const inc = x => x + 1
const odd = x => x % 2 !== 0

describe('Function utilities', () => {
  describe('curry', () => {
    const sum = curry((a, b, c) => a + b + c)

    it('works when passing all arguments', () => {
      const result = sum(1, 2, 3)
      expect(result).to.equal(6)
    })
    it('works when passing one less argument', () => {
      const result = sum(1, 2)(3)
      expect(result).to.equal(6)
    })
    it('works when passing two less arguments', () => {
      const result = sum(1)(2, 3)
      expect(result).to.equal(6)
    })
    it('works when passing no arguments', () => {
      const result = sum()(1, 2, 3)
      expect(result).to.equal(6)
    })
    it('works when all arguments are passed separately', () => {
      const result = sum(1)(2)(3)
      expect(result).to.equal(6)
    })
  })

  describe('curryY', () => {
    const sum = curryY((a, b, c) => a + b + c)

    it('works when passing all arguments, but sillier', () => {
      const result = sum(1, 2, 3)
      expect(result).to.equal(6)
    })
    it('works when passing one less argument, but sillier', () => {
      const result = sum(1, 2)(3)
      expect(result).to.equal(6)
    })
    it('works when passing two less arguments, but sillier', () => {
      const result = sum(1)(2, 3)
      expect(result).to.equal(6)
    })
    it('works when passing no arguments, but sillier', () => {
      const result = sum()(1, 2, 3)
      expect(result).to.equal(6)
    })
    it('works when all arguments are passed separately, but sillier', () => {
      const result = sum(1)(2)(3)
      expect(result).to.equal(6)
    })
  })

  describe('flip', () => {
    it('swaps parameters in a two-parameter curried function', () => {
      const regular = curry(take)([1, 2, 3, 4, 5])(3)
      const flipped = flip(curry(take))(3)([1, 2, 3, 4, 5])
      expect(regular).to.deep.equal([1, 2, 3])
      expect(flipped).to.deep.equal([1, 2, 3])
    })
    it('swaps parameter sets in a three-parameter curried function', () => {
      const regular = curry(reduce)([1, 2, 3, 4, 5])((a, b) => a + b, 0)
      const flipped = flip(curry(reduce))((a, b) => a + b, 0)([1, 2, 3, 4, 5])
      expect(regular).to.equal(15)
      expect(flipped).to.equal(15)
    })
  })

  describe('compose', () => {
    it('composes two or more functions into a single function', () => {
      const m = fn => iterable => Array.from(iterable).map(fn)
      const f = fn => iterable => Array.from(iterable).filter(fn)
      const t = n => iterable => Array.from(iterable).slice(0, n)

      const result = compose(t(2), f(odd), m(inc))(range(5))
      expect(result).to.deep.equal([1, 3])
    })
    it('works in conjunction with curry and flip', () => {
      const result = compose(
        flip(curry(take))(2),
        flip(curry(filter))(odd),
        flip(curry(map))(inc),
      )(range(5))
      expect(result).to.deep.equal([1, 3])
    })
  })

  describe('pipe', () => {
    it('pipes two or more functions into a single function', () => {
      const m = fn => iterable => Array.from(iterable).map(fn)
      const f = fn => iterable => Array.from(iterable).filter(fn)
      const t = n => iterable => Array.from(iterable).slice(0, n)

      const result = pipe(m(inc), f(odd), t(2))(range(5))
      expect(result).to.deep.equal([1, 3])
    })
    it('works in conjunction with curry and flip', () => {
      const result = pipe(
        flip(curry(map))(inc),
        flip(curry(filter))(odd),
        flip(curry(take))(2),
      )(range(5))
      expect(result).to.deep.equal([1, 3])
    })
  })
})
