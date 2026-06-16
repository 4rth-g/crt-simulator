const BTN = "px-4 py-2 bg-zinc-900 text-gray-300 font-mono border border-zinc-700 hover:bg-zinc-800 hover:text-white transition-colors text-sm"

const PATTERNS = [
  { name: 'coracao',    label: 'CORAÇÃO'    },
  { name: 'arvore',     label: 'ÁRVORE'     },
  { name: 'estrela',    label: 'ESTRELA'    },
  { name: 'solido',     label: 'SÓLIDO'     },
  { name: 'circulo',    label: 'CÍRCULO'    },
  { name: 'gradiente',  label: 'GRADIENTE'  },
  { name: 'vertical',   label: 'VERTICAL'   },
  { name: 'horizontal', label: 'HORIZONTAL' },
  { name: 'grade',      label: 'GRADE'      },
  { name: 'diagonal',   label: 'DIAGONAL'   },
  { name: 'xadrez',     label: 'XADREZ'     },
  { name: 'borda',      label: 'BORDA'      },
  { name: 'onda',       label: 'ONDA'       },
]

const Controls = ({ onClear, onPattern }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-wrap justify-center gap-2">
        {PATTERNS.map(p => (
          <button key={p.name} onClick={() => onPattern(p.name)} className={BTN}>
            {p.label}
          </button>
        ))}
      </div>
      <button onClick={onClear} className={`${BTN} border-red-900 text-red-400 hover:text-red-200 hover:bg-red-950 px-12`}>
        LIMPAR
      </button>
    </div>
  )
}

export default Controls
