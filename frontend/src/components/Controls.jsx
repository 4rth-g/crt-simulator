const BTN = "px-4 py-2 bg-zinc-900 text-gray-300 font-mono border border-zinc-700 hover:bg-zinc-800 hover:text-white transition-colors"

const Controls = ({ onClear, onPattern }) => {
  return (
    <div className="flex gap-3">
      <button onClick={() => onPattern('xadrez')} className={BTN}>XADREZ</button>
      <button onClick={() => onPattern('borda')} className={BTN}>BORDA</button>
      <button onClick={() => onPattern('onda')} className={BTN}>ONDA</button>
      <button onClick={onClear} className={BTN}>LIMPAR</button>
    </div>
  )
}

export default Controls
