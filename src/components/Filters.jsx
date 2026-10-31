import { useState } from 'react'
import RangeSlider from './RangeSlider'
import { colorOf, textOn } from '../utils/typeColors'
import { SORT_OPTIONS, STATS } from '../utils/pokemon'
import '../css/Filters.css'

const VIEW_MODES = [
  { value: 'grid', label: 'Grade' },
  { value: 'table', label: 'Lista' },
]

export default function Filters({
  types,
  selectedTypes,
  onToggleType,
  onClearTypes,
  typeMode,
  onTypeModeChange,
  sortKey,
  onSortChange,
  favoritesOnly,
  onToggleFavoritesOnly,
  favoritesCount,
  caughtFilter,
  onCaughtFilterChange,
  statLimits,
  statRanges,
  onStatRangeChange,
  onResetStatRanges,
  viewMode,
  onViewModeChange,
  onRandom,
}) {
  const [showStats, setShowStats] = useState(false)
  // Quantos atributos estão com a faixa diferente da padrão (aparece no botão)
  const activeStats = STATS.filter(
    (s) => statRanges[s.key][0] !== statLimits[s.key][0] || statRanges[s.key][1] !== statLimits[s.key][1],
  ).length

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
                  : { '--type-color': colorOf(t.name) }
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
        {/* Só faz diferença com dois ou mais tipos marcados */}
        {selectedTypes.length > 1 && (
          <label className="select">
            <span>Tipos</span>
            <select value={typeMode} onChange={(e) => onTypeModeChange(e.target.value)}>
              <option value="any">Qualquer um dos marcados</option>
              <option value="all">Todos os marcados</option>
            </select>
          </label>
        )}

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

        <label className="select">
          <span>Coleção</span>
          <select value={caughtFilter} onChange={(e) => onCaughtFilterChange(e.target.value)}>
            <option value="all">Todos</option>
            <option value="caught">Capturados</option>
            <option value="missing">Faltando</option>
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

        <button
          type="button"
          className={`btn ${activeStats > 0 ? 'btn--active' : ''}`}
          aria-expanded={showStats}
          aria-controls="stat-filters"
          onClick={() => setShowStats((v) => !v)}
        >
          Atributos{activeStats > 0 ? ` (${activeStats})` : ''} {showStats ? '▴' : '▾'}
        </button>

        <button type="button" className="btn" onClick={onRandom}>
          Pokémon aleatório
        </button>

        <div className="segmented filters__view" role="group" aria-label="Modo de visualização">
          {VIEW_MODES.map((m) => (
            <button
              type="button"
              key={m.value}
              className={viewMode === m.value ? 'is-active' : ''}
              aria-pressed={viewMode === m.value}
              onClick={() => onViewModeChange(m.value)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {showStats && (
        <div id="stat-filters" className="filters__stats">
          {STATS.map((s) => (
            <RangeSlider
              key={s.key}
              label={s.label}
              min={statLimits[s.key][0]}
              max={statLimits[s.key][1]}
              value={statRanges[s.key]}
              onChange={(range) => onStatRangeChange(s.key, range)}
            />
          ))}
          <button
            type="button"
            className="btn filters__reset"
            disabled={activeStats === 0}
            onClick={onResetStatRanges}
          >
            Redefinir atributos
          </button>
        </div>
      )}
    </div>
  )
}
