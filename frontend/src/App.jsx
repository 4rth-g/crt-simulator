import { useState, useEffect, useCallback } from 'react'
import PixelGrid from './components/PixelGrid'
import Controls from './components/Controls'

const ROWS = 30
const COLS = 60

const App = () => {
  const [grid, setGrid] = useState([])
  const [animate, setAnimate] = useState(false)

  const fetchGrid = useCallback((shouldAnimate = false) => {
    setAnimate(shouldAnimate)
    fetch('/api/state')
      .then(r => r.json())
      .then(setGrid)
  }, [])

  useEffect(() => { fetchGrid(false) }, [fetchGrid])

  const handlePixelClick = (row, col) => {
    const current = grid[row]?.[col] ?? 0
    const value = current > 0 ? 0 : 255
    fetch('/api/pixel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ row, col, value }),
    }).then(() => fetchGrid(false))
  }

  const handleClear = () => {
    fetch('/api/clear', { method: 'POST' }).then(() => fetchGrid(false))
  }

  const handlePattern = (name) => {
    fetch(`/api/pattern?name=${name}`, { method: 'POST' }).then(() => fetchGrid(true))
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6">
      <h1 className="text-gray-200 text-2xl font-mono tracking-widest">CRT SIMULATOR</h1>
      <div className="shadow-[0_0_40px_rgba(255,255,255,0.08)] rounded-sm border border-zinc-800">
        <PixelGrid grid={grid} rows={ROWS} cols={COLS} onPixelClick={handlePixelClick} animate={animate} />
      </div>
      <Controls onClear={handleClear} onPattern={handlePattern} />
    </div>
  )
}

export default App
