// Copyright (c) 2020 Thomas J. Otterson
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { expect } from 'chai'

import {
  final, frozen, Nothing, NullClass, tracked,
} from 'modules/objects.mjs'

describe('Object functions', () => {
  describe('trackedFactory', () => {
    const factory = (a, b) => ({ a, b })

    it('returns a function that produces the same objects', () => {
      const fac = tracked(factory)
      expect(factory(1, 2)).to.deep.equal({ a: 1, b: 2 })
      expect(fac(1, 2)).to.deep.equal({ a: 1, b: 2 })
    })
    it('adds a `created` method to the factory', () => {
      const fac = tracked(factory)
      expect(fac.created).to.be.a('function')
    })
    it('can add a method of a different name', () => {
      const fac = tracked(factory, 'made')
      expect(fac.made).to.be.a('function')
    })
    it('can use added method to see if the factory created an object', () => {
      const fac = tracked(factory)
      const notCreated = factory(1, 2)
      const created = fac(1, 2)
      expect(created).to.deep.equal(notCreated)
      expect(fac.created(created)).to.be.true
      expect(fac.created(notCreated)).to.be.false
    })
  })

  describe('frozen', () => {
    const Point2d = frozen(class Point2d {
      constructor(x, y) {
        this.x = x
        this.y = y
      }
    })

    it('creates a class whose properties are frozen', () => {
      const p = new Point2d(1, 2)
      expect(p.x).to.equal(1)
      expect(p.y).to.equal(2)

      expect(() => (p.x = 42)).to.throw() // modify current property
      expect(() => (p.z = 42)).to.throw() // add new property
      expect(() => delete p.x).to.throw() // delete old property
    })
    it('allows properties to be modified after extension', () => {
      class Point3d extends Point2d {
        constructor(x, y, z) {
          super(x, y)
          this.z = z
        }
      }
      const p = new Point3d(1, 2, 3)
      expect(p.z).to.equal(3)
      expect(() => (p.x = 42)).not.to.throw()
    })
    it('can create classes that extend from other frozen classes', () => {
      const Point3d = frozen(class Point3d extends Point2d {
        constructor(x, y, z) {
          super(x, y)
          this.z = z
        }
      })
      const p = new Point3d(1, 2, 3)
      expect(p.z).to.equal(3)
      expect(() => (p.z = 42)).to.throw() // modify child property
      expect(() => (p.x = 42)).to.throw() // modify base property
      expect(() => (p.w = 42)).to.throw() // add new property
      expect(() => delete p.z).to.throw() // delete old property
    })
    it('uses the original class name as its own name', () => {
      expect(Point2d.name).to.equal('Point2d')
    })
    it('uses `Frozen` as a class name if the original has no name', () => {
      expect(frozen(class {}).name).to.equal('Frozen')
    })
  })

  describe('final', () => {
    const Point2d = final(class Point2d {
      constructor(x, y) {
        this.x = x
        this.y = y
      }
    })

    it('creates a class whose properties are frozen', () => {
      const p = new Point2d(1, 2)
      expect(p.x).to.equal(1)
      expect(p.y).to.equal(2)

      expect(() => (p.x = 42)).to.throw() // modify current property
      expect(() => (p.z = 42)).to.throw() // add new property
      expect(() => delete p.x).to.throw() // delete old property
    })
    it('does not allow properties to be added through extension', () => {
      class Point3d extends Point2d {
        constructor(x, y, z) {
          super(x, y)
          this.z = z
        }
      }
      expect(() => new Point3d(1, 2, 3)).to.throw()
    })
    it('does not allow properties to be modified through extension', () => {
      class AltPoint extends Point2d {}
      const p = new AltPoint(1, 2) // this is fine, nothing has been modified
      expect(() => (p.x = 42)).to.throw() // this is not fine
    })
    it('uses the original class name as its own name', () => {
      expect(Point2d.name).to.equal('Point2d')
    })
    it('uses `Final` as a class name if the original has no name', () => {
      expect(final(class {}).name).to.equal('Final')
    })
  })

  describe('NullClass', () => {
    it('can be extended if Object properties are not needed', () => {
      class Test extends Object {}
      class TestNull extends NullClass {}
      expect(new Test()).to.respondTo('toString')
      expect(new TestNull()).not.to.respondTo('toString')
    })
  })

  describe('Nothing', () => {
    it('is an object with no enumerable properties', () => {
      expect(Object.keys(Nothing)).to.deep.equal([])
    })
    it('returns expected values for its four defined properties', () => {
      expect(Nothing.toString()).to.equal('Nothing')
      expect(Nothing.toLocaleString()).to.equal('Nothing')
      expect(Nothing.valueOf()).to.be.undefined
      expect(Nothing[Symbol.toPrimitive]()).to.be.undefined
    })
    it('returns Nothing from any other property read', () => {
      expect(Nothing.a).to.equal(Nothing)
      expect(Nothing.keys).to.equal(Nothing)
      expect(Nothing['some-prop']).to.equal(Nothing)
      expect(Nothing[Symbol.iterator]).to.equal(Nothing)
    })
    it('returns Nothing from any array access', () => {
      expect(Nothing[0]).to.equal(Nothing)
      expect(Nothing[16777216]).to.equal(Nothing)
      expect(Nothing[-1]).to.equal(Nothing)
    })
    it('returns Nothing from any function invocation', () => {
      expect(Nothing()).to.equal(Nothing)
      expect(Nothing(1, 2, 3)).to.equal(Nothing)
      expect(Nothing(x => x + 1)).to.equal(Nothing)
      expect(Nothing(1)(2)).to.equal(Nothing)
      expect(Nothing(...[1, 2, 3])).to.equal(Nothing)
    })
    it('allows chaining of all of these to always produce Nothing', () => {
      const start = Nothing
      const result = start.a.b[2].map(x => x + 1)[''](1)(5).x().y
      expect(result).to.equal(Nothing)
    })
  })
})
