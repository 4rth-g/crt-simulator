import { useEffect, useRef } from 'react'

const CELL = 14

export default function PixelGrid({ grid, rows, cols, onPixelClick }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!grid.length) return
    const ctx = canvasRef.current.getContext('2d')

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, cols * CELL, rows * CELL)

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = grid[r]?.[c] ?? 0
        if (v > 0) {
          ctx.fillStyle = `rgb(${v}, ${Math.floor(v * 0.75)}, 0)`
          ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2)
        }
      }
    }
  }, [grid, rows, cols])

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const col = Math.floor((e.clientX - rect.left) / CELL)
    const row = Math.floor((e.clientY - rect.top) / CELL)
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      onPixelClick(row, col)
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={cols * CELL}
      height={rows * CELL}
      onClick={handleClick}
      className="border border-gray-700 cursor-crosshair"
    />
  )
}
