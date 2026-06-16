import { useState, useEffect, useCallback, useMemo } from 'react'
import PixelGrid from './components/PixelGrid'
import Controls from './components/Controls'
import DataPanel from './components/DataPanel'

const ROWS = 40
const COLS = 80

const App = () => {
  const [grid, setGrid] = useState([])
  const [animate, setAnimate] = useState(false)
  const phosphor = 'white'
  const [showData, setShowData] = useState(false)

  const activeNodes = useMemo(
    () => grid.flat().filter(v => v > 0).length,
    [grid]
  )

  const fetchGrid = useCallback((shouldAnimate = false) => {
    setAnimate(shouldAnimate)
    fetch('/api/state')
      .then(r => r.json())
      .then(setGrid)
  }, [])

  useEffect(() => { fetchGrid(false) }, [fetchGrid])

  const handlePixelDraw = (row, col, value) => {
    // Atualização otimista para feedback imediato no canvas
    setGrid(prev => {
      if (!prev.length) return prev
      const next = prev.map(r => [...r])
      if (next[row]) next[row][col] = value
      return next
    })
    fetch('/api/pixel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ row, col, value }),
    })
  }

  const handleClear = () => {
    fetch('/api/clear', { method: 'POST' }).then(() => fetchGrid(false))
  }

  const handlePattern = (name) => {
    fetch(`/api/pattern?name=${name}`, { method: 'POST' }).then(() => fetchGrid(true))
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center gap-8 py-10">
      <h1 className="text-gray-200 text-2xl font-mono tracking-widest">CRT SIMULATOR</h1>

      <div className="flex flex-col items-center">
        {/* Antenas */}
        <div className="flex gap-10 -mb-1 pointer-events-none">
          <div className="w-[2px] h-14 bg-zinc-500 rounded-t origin-bottom -rotate-12" />
          <div className="w-[2px] h-14 bg-zinc-500 rounded-t origin-bottom rotate-12" />
        </div>

        {/* Corpo da TV */}
        <div className="bg-zinc-700 rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.85)] border-t border-zinc-600 p-6 pb-5">
          {/* Tela recuada */}
          <div className="bg-zinc-900 rounded p-3 shadow-[inset_0_4px_20px_rgba(0,0,0,0.95)]">
            <PixelGrid
              grid={grid}
              rows={ROWS}
              cols={COLS}
              onPixelDraw={handlePixelDraw}
              animate={animate}
              phosphor={phosphor}
            />
          </div>

          {/* Barra inferior: marca + contador de nós + botões decorativos */}
          <div className="flex items-center justify-between mt-4 px-1">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-zinc-400 text-sm tracking-[0.25em]">CRT-SIM</span>
              <span className="font-mono text-zinc-500 text-xs">{activeNodes} / {ROWS * COLS} nós</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-700   border border-red-500   shadow-inner" />
              <div className="w-4 h-4 rounded-full bg-green-700 border border-green-500 shadow-inner" />
              <div className="w-3 h-7 rounded-sm bg-yellow-600 border border-yellow-400 shadow-inner" />
              <div className="w-3 h-7 rounded-sm bg-blue-700  border border-blue-500  shadow-inner" />
            </div>
          </div>
        </div>
      </div>

      <Controls onClear={handleClear} onPattern={handlePattern} />

      <button
        onClick={() => setShowData(v => !v)}
        className="font-mono text-xs text-zinc-500 border border-zinc-700 px-4 py-1 hover:text-zinc-300 hover:border-zinc-500 transition-colors"
      >
        {showData ? 'OCULTAR ESTRUTURA' : 'VER ESTRUTURA'}
      </button>

      {showData && <DataPanel grid={grid} rows={ROWS} cols={COLS} />}
    </div>
  )
}

export default App
