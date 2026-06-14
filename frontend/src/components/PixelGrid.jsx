import { useEffect, useRef } from 'react'

const CELL = 14
const PIXELS_PER_FRAME = 10  // quantos pixels o feixe avança por frame (~60fps → ~3s por varredura)
const DECAY = 0.99            // fator de decaimento do fósforo por frame

const PixelGrid = ({ grid, rows, cols, onPixelClick, animate }) => {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    luminance: new Float32Array(rows * cols), // brilho atual de cada pixel (0-255)
    isScanning: false,
    scanPos: 0,   // posição linear do feixe: pos = r * cols + c
    grid: null,
  })

  // Reage a mudanças no grid: scan animado ou atualização instantânea
  useEffect(() => {
    if (!grid.length) return
    const s = stateRef.current
    s.grid = grid

    if (animate) {
      // Inicia varredura do zero, como um CRT ligando
      s.luminance.fill(0)
      s.scanPos = 0
      s.isScanning = true
    } else {
      // Atualização instantânea (clique em pixel, limpar)
      s.isScanning = false
      s.scanPos = 0
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          s.luminance[r * cols + c] = grid[r]?.[c] ?? 0
    }
  }, [grid, animate, rows, cols])

  // Loop RAF permanente: decaimento + avanço do feixe + renderização
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const total = rows * cols
    let rafId

    const frame = () => {
      const s = stateRef.current

      if (s.isScanning && s.grid) {
        // 1. Decai o fósforo de todos os pixels já excitados
        for (let i = 0; i < total; i++) {
          s.luminance[i] *= DECAY
          if (s.luminance[i] < 1) s.luminance[i] = 0
        }

        // 2. Feixe avança e excita os próximos pixels ao nível do sinal de vídeo
        //    Isso espelha: para cada Lista em Multilista[], percorre nó a nó
        const end = Math.min(s.scanPos + PIXELS_PER_FRAME, total)
        for (let i = s.scanPos; i < end; i++) {
          const r = Math.floor(i / cols)  // índice da Lista na Multilista
          const c = i % cols              // índice do nó na Lista
          s.luminance[i] = s.grid[r]?.[c] ?? 0
        }
        s.scanPos = end

        // 3. Varredura completa: estabiliza os valores finais (sem mais decaimento)
        if (s.scanPos >= total) {
          s.isScanning = false
          for (let r = 0; r < rows; r++)
            for (let c = 0; c < cols; c++)
              s.luminance[r * cols + c] = s.grid[r]?.[c] ?? 0
        }
      }

      // Renderização
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, cols * CELL, rows * CELL)

      ctx.shadowBlur = 10
      ctx.shadowColor = 'rgba(255,255,255,0.8)'
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const lum = s.luminance[r * cols + c]
          if (lum > 1) {
            const b = Math.round(lum)
            ctx.fillStyle = `rgb(${b},${b},${b})`
            ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2)
          }
        }
      }
      ctx.shadowBlur = 0

      // Indicador da posição do feixe: brilho residual na scanline atual
      if (s.isScanning && s.scanPos < total) {
        const beamRow = Math.floor(s.scanPos / cols)
        ctx.fillStyle = 'rgba(255,255,255,0.04)'
        ctx.fillRect(0, beamRow * CELL, cols * CELL, CELL)
      }

      // Overlay de scanlines (linhas horizontais escuras entre as linhas de varredura)
      for (let r = 0; r < rows; r++) {
        ctx.fillStyle = 'rgba(0,0,0,0.25)'
        ctx.fillRect(0, r * CELL, cols * CELL, 1)
      }

      rafId = requestAnimationFrame(frame)
    }

    rafId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafId)
  }, [rows, cols])

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const col = Math.floor((e.clientX - rect.left) / CELL)
    const row = Math.floor((e.clientY - rect.top) / CELL)
    if (row >= 0 && row < rows && col >= 0 && col < cols)
      onPixelClick(row, col)
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

export default PixelGrid
