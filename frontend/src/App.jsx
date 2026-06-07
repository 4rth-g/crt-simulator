import { useState, useEffect, useCallback } from 'react'
import PixelGrid from './components/PixelGrid'
import Controls from './components/Controls'

const ROWS = 30
const COLS = 60

export default function App() {
  const [grid, setGrid] = useState([])

  const fetchGrid = useCallback(() => {
    fetch('/api/state')
      .then(r => r.json())
      .then(setGrid)
  }, [])

  useEffect(() => { fetchGrid() }, [fetchGrid])

  const handlePixelClick = (row, col) => {
    const current = grid[row]?.[col] ?? 0
    const value = current > 0 ? 0 : 255
    fetch('/api/pixel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ row, col, value }),
    }).then(fetchGrid)
  }

  const handleClear = () => {
    fetch('/api/clear', { method: 'POST' }).then(fetchGrid)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6">
      <h1 className="text-green-400 text-2xl font-mono tracking-widest">CRT SIMULATOR</h1>
      <PixelGrid grid={grid} rows={ROWS} cols={COLS} onPixelClick={handlePixelClick} />
      <Controls onClear={handleClear} />
    </div>
  )
}
