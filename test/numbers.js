// Copyright (c) 2021 Thomas J. Otterson
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict'

const { expect } = require('chai')

const { ordinal, wordinal } = require('../modules/numbers')

describe('Number utilities', () => {
  describe('ordinal', () => {
    it('returns the ordinal for numbers under 20', () => {
      expect(ordinal(0)).to.equal('0th')
      expect(ordinal(1)).to.equal('1st')
      expect(ordinal(2)).to.equal('2nd')
      expect(ordinal(3)).to.equal('3rd')
      expect(ordinal(4)).to.equal('4th')
      expect(ordinal(5)).to.equal('5th')
      expect(ordinal(6)).to.equal('6th')
      expect(ordinal(7)).to.equal('7th')
      expect(ordinal(8)).to.equal('8th')
      expect(ordinal(9)).to.equal('9th')
      expect(ordinal(10)).to.equal('10th')
      expect(ordinal(11)).to.equal('11th')
      expect(ordinal(12)).to.equal('12th')
      expect(ordinal(13)).to.equal('13th')
      expect(ordinal(14)).to.equal('14th')
      expect(ordinal(15)).to.equal('15th')
      expect(ordinal(16)).to.equal('16th')
      expect(ordinal(17)).to.equal('17th')
      expect(ordinal(18)).to.equal('18th')
      expect(ordinal(19)).to.equal('19th')
    })
    it('returns the ordinals for even 10s', () => {
      expect(ordinal(20)).to.equal('20th')
      expect(ordinal(30)).to.equal('30th')
      expect(ordinal(40)).to.equal('40th')
      expect(ordinal(50)).to.equal('50th')
      expect(ordinal(60)).to.equal('60th')
      expect(ordinal(70)).to.equal('70th')
      expect(ordinal(80)).to.equal('80th')
      expect(ordinal(90)).to.equal('90th')
    })
    it('returns the ordinals for even 100s', () => {
      expect(ordinal(100)).to.equal('100th')
      expect(ordinal(200)).to.equal('200th')
      expect(ordinal(300)).to.equal('300th')
      expect(ordinal(400)).to.equal('400th')
      expect(ordinal(500)).to.equal('500th')
      expect(ordinal(600)).to.equal('600th')
      expect(ordinal(700)).to.equal('700th')
      expect(ordinal(800)).to.equal('800th')
      expect(ordinal(900)).to.equal('900th')
    })
    it('returns the ordinals for even higher powers', () => {
      expect(ordinal(1000)).to.equal('1000th')
      expect(ordinal(10000)).to.equal('10000th')
      expect(ordinal(100000)).to.equal('100000th')
      expect(ordinal(1000000)).to.equal('1000000th')
      expect(ordinal(1000000000)).to.equal('1000000000th')
      expect(ordinal(1000000000000)).to.equal('1000000000000th')
    })
    it('returns ordinals for numbers that are not multiples of 10', () => {
      expect(ordinal(21)).to.equal('21st')
      expect(ordinal(22)).to.equal('22nd')
      expect(ordinal(23)).to.equal('23rd')
      expect(ordinal(24)).to.equal('24th')
      expect(ordinal(25)).to.equal('25th')
      expect(ordinal(26)).to.equal('26th')
      expect(ordinal(27)).to.equal('27th')
      expect(ordinal(28)).to.equal('28th')
      expect(ordinal(29)).to.equal('29th')
    })
  })

  describe('wordinal', () => {
    it('returns the word ordinal for numbers under 20', () => {
      expect(() => wordinal(-1)).to.throw()
      expect(wordinal(0)).to.equal('zeroth')
      expect(wordinal(1)).to.equal('first')
      expect(wordinal(2)).to.equal('second')
      expect(wordinal(3)).to.equal('third')
      expect(wordinal(4)).to.equal('fourth')
      expect(wordinal(5)).to.equal('fifth')
      expect(wordinal(6)).to.equal('sixth')
      expect(wordinal(7)).to.equal('seventh')
      expect(wordinal(8)).to.equal('eighth')
      expect(wordinal(9)).to.equal('ninth')
      expect(wordinal(10)).to.equal('tenth')
      expect(wordinal(11)).to.equal('eleventh')
      expect(wordinal(12)).to.equal('twelfth')
      expect(wordinal(13)).to.equal('thirteenth')
      expect(wordinal(14)).to.equal('fourteenth')
      expect(wordinal(15)).to.equal('fifteenth')
      expect(wordinal(16)).to.equal('sixteenth')
      expect(wordinal(17)).to.equal('seventeenth')
      expect(wordinal(18)).to.equal('eighteenth')
      expect(wordinal(19)).to.equal('nineteenth')
    })
    it('returns the word ordinal for tens from 20 to 90', () => {
      expect(wordinal(20)).to.equal('twentieth')
      expect(wordinal(30)).to.equal('thirtieth')
      expect(wordinal(40)).to.equal('fortieth')
      expect(wordinal(50)).to.equal('fiftieth')
      expect(wordinal(60)).to.equal('sixtieth')
      expect(wordinal(70)).to.equal('seventieth')
      expect(wordinal(80)).to.equal('eightieth')
      expect(wordinal(90)).to.equal('ninetieth')
    })
    it('returns the word ordinal for non-tens from 20 to 99', () => {
      expect(wordinal(21)).to.equal('twenty-first')
      expect(wordinal(32)).to.equal('thirty-second')
      expect(wordinal(43)).to.equal('forty-third')
      expect(wordinal(54)).to.equal('fifty-fourth')
      expect(wordinal(65)).to.equal('sixty-fifth')
      expect(wordinal(76)).to.equal('seventy-sixth')
      expect(wordinal(87)).to.equal('eighty-seventh')
      expect(wordinal(98)).to.equal('ninety-eighth')
      expect(wordinal(99)).to.equal('ninety-ninth')
    })
    it('returns the word ordinal for even hundreds up to 900', () => {
      expect(wordinal(100)).to.equal('one hundredth')
      expect(wordinal(200)).to.equal('two hundredth')
      expect(wordinal(300)).to.equal('three hundredth')
      expect(wordinal(400)).to.equal('four hundredth')
      expect(wordinal(500)).to.equal('five hundredth')
      expect(wordinal(600)).to.equal('six hundredth')
      expect(wordinal(700)).to.equal('seven hundredth')
      expect(wordinal(800)).to.equal('eight hundredth')
      expect(wordinal(900)).to.equal('nine hundredth')
    })
    it('returns the word ordinal for non-hundreds up to 999', () => {
      expect(wordinal(102)).to.equal('one hundred second')
      expect(wordinal(213)).to.equal('two hundred thirteenth')
      expect(wordinal(324)).to.equal('three hundred twenty-fourth')
      expect(wordinal(435)).to.equal('four hundred thirty-fifth')
      expect(wordinal(546)).to.equal('five hundred forty-sixth')
      expect(wordinal(657)).to.equal('six hundred fifty-seventh')
      expect(wordinal(768)).to.equal('seven hundred sixty-eighth')
      expect(wordinal(879)).to.equal('eight hundred seventy-ninth')
      expect(wordinal(980)).to.equal('nine hundred eightieth')
    })
    it('returns the word ordinal for even higher groups', () => {
      expect(wordinal(1000)).to.equal('one thousandth')
      expect(wordinal(2000000)).to.equal('two millionth')
      expect(wordinal(3000000000)).to.equal('three billionth')
      expect(wordinal(4000000000000)).to.equal('four trillionth')
      expect(wordinal(5000000000000000)).to.equal('five quadrillionth')
      expect(() => wordinal(6000000000000000000)).to.throw()
    })
    it('returns the word ordinal for multiple higher groups', () => {
      expect(wordinal(1100)).to.equal('one thousand one hundredth')
      expect(wordinal(2160000)).to.equal(
        'two million one hundred sixty thousandth',
      )
      expect(wordinal(32010002400)).to.equal(
        'thirty-two billion ten million two thousand four hundredth',
      )
      expect(wordinal(Number.MAX_SAFE_INTEGER)).to.equal(
        'nine quadrillion seven trillion one hundred ninety-nine billion '
          + 'two hundred fifty-four million seven hundred forty thousand '
          + 'nine hundred ninety-first',
      )
    })
  })
})
