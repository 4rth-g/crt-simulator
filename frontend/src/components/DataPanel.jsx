const DataPanel = ({ grid, rows, cols }) => {
  const rowStats = grid.map((row, i) => ({
    i,
    active: row.filter(v => v > 0).length,
  }))

  const totalActive = rowStats.reduce((s, r) => s + r.active, 0)
  const activeLists = rowStats.filter(r => r.active > 0).length

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded p-4 font-mono text-xs w-full max-w-2xl">
      {/* Cabeçalho */}
      <div className="flex justify-between items-baseline mb-3 pb-2 border-b border-zinc-700">
        <span className="text-zinc-300 tracking-widest text-sm">MULTILISTA</span>
        <span className="text-zinc-500">
          {activeLists} listas ativas · {totalActive} / {rows * cols} nós
        </span>
      </div>

      {/* Grid de 2 colunas — 20 listas por coluna */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-[3px]">
        {rowStats.map(({ i, active }) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-zinc-600 w-7 text-right shrink-0">
              L{String(i).padStart(2, '0')}
            </span>
            <div className="flex-1 h-[6px] bg-zinc-800 rounded-sm overflow-hidden">
              <div
                className="h-full bg-zinc-300 rounded-sm transition-all duration-150"
                style={{ width: `${(active / cols) * 100}%` }}
              />
            </div>
            <span className="text-zinc-500 w-6 text-right shrink-0">{active}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DataPanel
