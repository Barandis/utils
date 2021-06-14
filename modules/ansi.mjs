// Copyright (c) 2021 Thomas J. Otterson
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const CSI = '\x1b['

function optN(code, defN, n, m) {
  const [num, msg] = typeof m !== 'undefined' ? [n, m] : [defN, n]
  return `${CSI}${num === defN ? '' : num}${code}${msg}`
}

function optN1(code, defN, n, m) {
  const [num, msg] = typeof m !== 'undefined' ? [n, m] : [defN, n]
  return `${CSI}${num === defN ? '' : num + 1}${code}${msg}`
}

function color(n, m) {
  return `${CSI}38;5;${n}m${m}${CSI}0m`
}

function bgcolor(n, m) {
  return `${CSI}48;5;${n}m${m}${CSI}0m`
}

export const up = (n, m) => optN('A', 1, n, m)
export const down = (n, m) => optN('B', 1, n, m)
export const forward = (n, m) => optN('C', 1, n, m)
export const back = (n, m) => optN('D', 1, n, m)
export const next = (n, m) => optN('E', 1, n, m)
export const previous = (n, m) => optN('F', 1, n, m)
export const column = (n, m) => optN1('G', 0, n, m)
export const position = (x, y, m) => `${CSI}${y + 1};${x + 1}H${m}`
export const home = m => `${CSI}H${m}`
export const clear = (n, m) => optN('J', 0, n, m)
export const clearLine = (n, m) => optN('K', 0, n, m)
export const scrollUp = (n, m) => optN('S', 1, n, m)
export const scrollDown = (n, m) => optN('T', 1, n, m)

export const reset = m => `${CSI}0m${m}`

export const black = m => color(0, m)
export const red = m => color(1, m)
export const green = m => color(2, m)
export const yellow = m => color(3, m)
export const blue = m => color(4, m)
export const magenta = m => color(5, m)
export const cyan = m => color(6, m)
export const white = m => color(7, m)

export const brBlack = m => color(8, m)
export const brRed = m => color(9, m)
export const brGreen = m => color(10, m)
export const brYellow = m => color(11, m)
export const brBlue = m => color(12, m)
export const brMagenta = m => color(13, m)
export const brCyan = m => color(14, m)
export const brWhite = m => color(15, m)

export const bgBlack = m => bgcolor(0, m)
export const bgRed = m => bgcolor(1, m)
export const bgGreen = m => bgcolor(2, m)
export const bgYellow = m => bgcolor(3, m)
export const bgBlue = m => bgcolor(4, m)
export const bgMagenta = m => bgcolor(5, m)
export const bgCyan = m => bgcolor(6, m)
export const bgWhite = m => bgcolor(7, m)

export const bgBrBlack = m => bgcolor(8, m)
export const bgBrRed = m => bgcolor(9, m)
export const bgBrGreen = m => bgcolor(10, m)
export const bgBrYellow = m => bgcolor(11, m)
export const bgBrBlue = m => bgcolor(12, m)
export const bgBrMagenta = m => bgcolor(13, m)
export const bgBrCyan = m => bgcolor(14, m)
export const bgBrWhite = m => bgcolor(15, m)

export const rgb = (r, g, b, m) => color(16 + 36 * r + 6 * g + b, m)
export const bgRgb = (r, g, b, m) => bgcolor(16 + 36 * r + 6 * g + b, m)

export const gray = (n, m) => color(232 + n, m)
export const bgGray = (n, m) => bgcolor(232 + n, m)
