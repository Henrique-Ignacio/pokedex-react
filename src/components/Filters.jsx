import { colorOf, textOn } from '../utils/typeColors'
import { SORT_OPTIONS } from '../utils/pokemon'
import '../css/Filters.css'

export default function Filters({
  types,
  selectedTypes,
  onToggleType,
  onClearTypes,
  sortKey,
  onSortChange,
  favoritesOnly,
  onToggleFavoritesOnly,
  favoritesCount,
  onRandom,
}) {
  return (
    <div className="filters">
      <div className="filters__types" role="group" aria-label="Filtrar por tipo">
        <button
          type="button"
          className={`chip ${selectedTypes.length === 0 ? 'chip--active' : ''}`}
          aria-pressed={selectedTypes.length === 0}
          onClick={onClearTypes}
        >
          Todos
        </button>
        {types.map((t) => {
          const active = selectedTypes.includes(t.id)
          return (
            <button
              type="button"
              key={t.id}
              className={`chip chip--type ${active ? 'chip--active' : ''}`}
              style={
                active
                  ? { background: colorOf(t.name), color: textOn(t.name), borderColor: colorOf(t.name) }
                  : { '--dot': colorOf(t.name) }
              }
              aria-pressed={active}
              onClick={() => onToggleType(t.id)}
            >
              {t.name}
            </button>
          )
        })}
      </div>

      <div className="filters__tools">
        <label className="select">
          <span>Ordenar por</span>
          <select value={sortKey} onChange={(e) => onSortChange(e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className={`btn ${favoritesOnly ? 'btn--active' : ''}`}
          aria-pressed={favoritesOnly}
          onClick={onToggleFavoritesOnly}
        >
          ★ Favoritos ({favoritesCount})
        </button>

        <button type="button" className="btn" onClick={onRandom}>
          Pokémon aleatório
        </button>
      </div>
    </div>
  )
}
