export default function Controls({ onClear }) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onClear}
        className="px-4 py-2 bg-gray-800 text-green-400 font-mono border border-gray-600 hover:bg-gray-700 transition-colors"
      >
        LIMPAR
      </button>
    </div>
  )
}
