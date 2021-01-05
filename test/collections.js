// Copyright (c) 2020 Thomas J. Otterson
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { expect } from 'chai'

import { pluck, scan } from 'modules/collections.mjs'
import { range } from 'modules/iterators.mjs'

describe('Collection utilities', () => {
  describe('pluck', () => {
    it('returns all values of a given key', () => {
      const objs = [
        { a: 1, b: 2, c: 3 },
        { a: 4, b: 5, c: 6 },
        { a: 7, c: 9 },
      ]
      expect(pluck(objs, 'a')).to.deep.equal([1, 4, 7])
      expect(pluck(objs, 'b')).to.deep.equal([2, 5, undefined])
      expect(pluck(objs, 'c')).to.deep.equal([3, 6, 9])
    })
    it('works with non-array iterables', () => {
      function *test() {
        yield { a: 1, b: 2, c: 3 }
        yield { a: 4, b: 5, c: 6 }
        yield { a: 7, c: 9 }
      }
      expect(pluck(test(), 'a')).to.deep.equal([1, 4, 7])
      expect(pluck(test(), 'b')).to.deep.equal([2, 5, undefined])
      expect(pluck(test(), 'c')).to.deep.equal([3, 6, 9])
    })
  })

  describe('scan', () => {
    it('collects the intermediate results from a reduction', () => {
      const result = scan([0, 1, 2, 3, 4, 5], (a, b) => a + b, 0)
      expect(result).to.deep.equal([0, 1, 3, 6, 10, 15])
    })
    it('works with strings', () => {
      const result = scan('test', (a, b) => a + b.toUpperCase(), '')
      expect(result).to.deep.equal(['T', 'TE', 'TES', 'TEST'])
    })
    it('works with iterators', () => {
      const result = scan(range(6), (a, b) => a + b, 0)
      expect(result).to.deep.equal([0, 1, 3, 6, 10, 15])
    })
  })
})
