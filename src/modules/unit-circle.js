// Copyright (c) 2020 Thomas J. Otterson
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const TWO_PI = Math.PI * 2
const PI_OVER_TWO = Math.PI / 2

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} gridSize
 * @param {number} width
 */
function drawGrid(ctx, gridSize, width) {
  const halfWidth = Math.floor(width / 2)

  for (let y = -1; y <= 1; y++) {
    const position = y * gridSize

    ctx.fillStyle = '#ccc'
    ctx.fillRect(-halfWidth, position, width, 1)
    ctx.fillRect(position, -halfWidth, 1, width)

    ctx.font = '10pt serif'
    ctx.fillStyle = '#888'
    ctx.fillText(y, position + 5, 12)
    if (y) ctx.fillText(-y, 5, position + 12)
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cursorX
 * @param {number} cursorY
 */
function drawTriangle(ctx, cursorX, cursorY) {
  ctx.fillStyle = 'rgba(0, 255, 0, 0.2)'
  ctx.strokeStyle = '#888'
  ctx.beginPath()
  ctx.moveTo(0, 1)
  ctx.lineTo(cursorX, 1)
  ctx.lineTo(cursorX, cursorY)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#888'
  ctx.fillRect(0, 0, cursorX, 1)
  ctx.fillRect(cursorX, 0, 1, cursorY)

  const sign = v => v < 0 ? -1 : v > 0 ? 1 : 0
  const arrowSize = 7
  const backX = cursorX - sign(cursorX) * arrowSize
  const backY = cursorY - sign(cursorY) * arrowSize

  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.moveTo(cursorX, 1)
  ctx.lineTo(backX, -arrowSize * 0.7)
  ctx.lineTo(backX, arrowSize * 0.7)
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(cursorX, cursorY)
  ctx.lineTo(cursorX - arrowSize * 0.7, backY)
  ctx.lineTo(cursorX + arrowSize * 0.7, backY)
  ctx.fill()
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} gridSize
 */
function drawCircle(ctx, gridSize) {
  ctx.strokeStyle = '#00f'
  ctx.beginPath()
  ctx.arc(0, 0, gridSize, 0, 360)
  ctx.closePath()
  ctx.stroke()
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cursorX
 * @param {number} cursorY
 * @param {number} cursorRadius
 * @param {boolean} moving
 * @param {boolean} flash
 */
function drawCursor(ctx, cursorX, cursorY, cursorRadius, moving, flash) {
  ctx.strokeStyle = `rgba(${moving ? 100 : 0}, 0, 255, 1)`
  ctx.fillStyle = moving
    ? 'rgba(100, 0, 255, 0.5)'
    : `rgba(0, 0, 255, ${flash ? 0.3 : 0.1})`
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(cursorX, cursorY, cursorRadius, 0, 360)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.lineWidth = 1
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cursorX
 * @param {number} cursorY
 * @param {number} angle
 * @param {string} xLabel
 * @param {string} yLabel
 */
function drawCoords(ctx, cursorX, cursorY, angle, xLabel, yLabel) {
  ctx.font = '10pt sans-serif'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  for (let y = -2; y <= 2; y++) {
    for (let x = -2; x <= 2; x++) {
      drawText(x, y)
    }
  }
  ctx.fillStyle = '#000'
  drawText(0, 0)

  function drawText(x, y) {
    if (xLabel != null) {
      ctx.fillText(
        xLabel + Math.sin(angle).toFixed(2),
        cursorX / 2 + x - 25, y - 5,
      )
    }
    if (yLabel != null) {
      ctx.fillText(
        yLabel + (-Math.cos(angle)).toFixed(2),
        cursorX + x - 30, cursorY / 2 + y,
      )
    }
  }
}

/**
 * @param {number} value
 * @param {number} range
 */
function clamp(value, range) {
  if (range < 0.00001) return 0
  return value < 0
    ? value - Math.floor(value / range) * range
    : value % range
}

/**
 * @param {number} angle
 * @param {number} gridSize
 */
function cursorLocation(angle, gridSize) {
  return [
    Math.sin(angle) * gridSize,
    Math.cos(angle) * gridSize,
  ]
}

/**
 * @param {string} selector
 */
export function unitCircle(selector, {
  width = 300,
  height = 300,
  value = Math.PI / 5,
  xLabel = 'X=',
  yLabel = 'Y=',
  flash = true,
} = {}) {
  const parent = document.querySelector(selector)

  const canvas = document.createElement('canvas')
  canvas.width = width * window.devicePixelRatio
  canvas.height = height * window.devicePixelRatio
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  canvas.onselectstart = () => false

  const ctx = canvas.getContext('2d')

  const halfWidth = width / 2
  const halfHeight = height / 2
  const gridSize = Math.floor(Math.min(halfWidth, halfHeight) * 0.8)
  const centerX = Math.floor(halfWidth)
  const centerY = Math.floor(halfHeight)
  const cursorRadius = 10

  let moving = false
  let flashing = false
  let angle = clamp(value + PI_OVER_TWO, TWO_PI)

  function draw() {
    const [cursorX, cursorY] = cursorLocation(angle, gridSize)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()

    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    ctx.translate(centerX, centerY)

    drawGrid(ctx, gridSize, width)
    drawTriangle(ctx, cursorX, cursorY)
    drawCircle(ctx, gridSize)
    drawCursor(ctx, cursorX, cursorY, cursorRadius, moving, flashing)
    drawCoords(ctx, cursorX, cursorY, angle, xLabel, yLabel)

    ctx.restore()
  }

  draw()

  if (flash) {
    setInterval(() => {
      flashing = !flashing
      if (!moving) draw()
    }, 500)
  }

  canvas.addEventListener('mousedown', () => {
    moving = true
    draw()
  })
  canvas.addEventListener('mouseup', () => {
    moving = false
    draw()
  })
  canvas.addEventListener('mousemove', e => {
    if (!moving) return

    const rect = canvas.getBoundingClientRect()
    const x = e.pageX - rect.left - halfWidth
    const y = e.pageY - rect.top - halfHeight
    angle = Math.atan2(x, y)
    draw()

    const n = clamp(angle - PI_OVER_TWO, TWO_PI)
    const detail = {
      x: Math.sin(angle),
      y: -Math.cos(angle),
      angle: n,
    }
    const event = new CustomEvent('rotate', { detail })
    canvas.dispatchEvent(event)
  })

  parent.appendChild(canvas)

  return canvas
}
