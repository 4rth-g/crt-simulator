import { useEffect, useRef } from 'react'

const CELL = 14
const PIXELS_PER_FRAME = 20
const DECAY = 0.99

const PHOSPHOR_COLOR = {
  white: (b) => `rgb(${b},${b},${b})`,
  green: (b) => `rgb(${Math.round(b * 0.1)},${b},${Math.round(b * 0.35)})`,
  amber: (b) => `rgb(${b},${Math.round(b * 0.55)},0)`,
}

const PHOSPHOR_GLOW = {
  white: 'rgba(255,255,255,0.8)',
  green: 'rgba(0,255,80,0.8)',
  amber: 'rgba(255,160,0,0.8)',
}

const PixelGrid = ({ grid, rows, cols, onPixelDraw, animate, phosphor = 'white' }) => {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    luminance: new Float32Array(rows * cols),
    isScanning: false,
    scanPos: 0,
    grid: null,
  })
  const isDrawingRef = useRef(false)
  const drawValueRef = useRef(255)
  const lastCellRef = useRef(null)

  useEffect(() => {
    if (!grid.length) return
    const s = stateRef.current
    s.grid = grid
    if (animate) {
      s.luminance.fill(0)
      s.scanPos = 0
      s.isScanning = true
    } else {
      s.isScanning = false
      s.scanPos = 0
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          s.luminance[r * cols + c] = grid[r]?.[c] ?? 0
    }
  }, [grid, animate, rows, cols])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const total = rows * cols
    const colorFn = PHOSPHOR_COLOR[phosphor] ?? PHOSPHOR_COLOR.white
    const glowColor = PHOSPHOR_GLOW[phosphor] ?? PHOSPHOR_GLOW.white
    let rafId

    const frame = () => {
      const s = stateRef.current

      if (s.isScanning && s.grid) {
        for (let i = 0; i < total; i++) {
          s.luminance[i] *= DECAY
          if (s.luminance[i] < 1) s.luminance[i] = 0
        }
        const end = Math.min(s.scanPos + PIXELS_PER_FRAME, total)
        for (let i = s.scanPos; i < end; i++) {
          const r = Math.floor(i / cols)
          const c = i % cols
          s.luminance[i] = s.grid[r]?.[c] ?? 0
        }
        s.scanPos = end
        if (s.scanPos >= total) {
          s.isScanning = false
          for (let r = 0; r < rows; r++)
            for (let c = 0; c < cols; c++)
              s.luminance[r * cols + c] = s.grid[r]?.[c] ?? 0
        }
      }

      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, cols * CELL, rows * CELL)

      ctx.shadowBlur = 10
      ctx.shadowColor = glowColor
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const lum = s.luminance[r * cols + c]
          if (lum > 1) {
            ctx.fillStyle = colorFn(Math.round(lum))
            ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2)
          }
        }
      }
      ctx.shadowBlur = 0

      if (s.isScanning && s.scanPos < total) {
        const beamRow = Math.floor(s.scanPos / cols)
        ctx.fillStyle = 'rgba(255,255,255,0.04)'
        ctx.fillRect(0, beamRow * CELL, cols * CELL, CELL)
      }

      for (let r = 0; r < rows; r++) {
        ctx.fillStyle = 'rgba(0,0,0,0.25)'
        ctx.fillRect(0, r * CELL, cols * CELL, 1)
      }

      rafId = requestAnimationFrame(frame)
    }

    rafId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafId)
  }, [rows, cols, phosphor])

  const cellFromEvent = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const col = Math.floor((e.clientX - rect.left) / CELL)
    const row = Math.floor((e.clientY - rect.top) / CELL)
    return row >= 0 && row < rows && col >= 0 && col < cols ? { row, col } : null
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    const cell = cellFromEvent(e)
    if (!cell) return
    const current = stateRef.current.grid?.[cell.row]?.[cell.col] ?? 0
    drawValueRef.current = current > 0 ? 0 : 255
    isDrawingRef.current = true
    lastCellRef.current = cell
    onPixelDraw(cell.row, cell.col, drawValueRef.current)
  }

  const handleMouseMove = (e) => {
    if (!isDrawingRef.current) return
    const cell = cellFromEvent(e)
    if (!cell) return
    const last = lastCellRef.current
    if (last?.row === cell.row && last?.col === cell.col) return
    lastCellRef.current = cell
    onPixelDraw(cell.row, cell.col, drawValueRef.current)
  }

  const stopDrawing = () => {
    isDrawingRef.current = false
    lastCellRef.current = null
  }

  return (
    <canvas
      ref={canvasRef}
      width={cols * CELL}
      height={rows * CELL}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      className="block cursor-crosshair select-none"
    />
  )
}

export default PixelGrid
