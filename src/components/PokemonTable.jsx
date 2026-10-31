import PokemonImage from './PokemonImage'
import TypeBadge from './TypeBadge'
import { CaughtButton, FavoriteButton } from './CollectionButtons'
import { STATS, formatId, totalStats, typesOf } from '../utils/pokemon'

const COLUMNS = [
  { key: 'id', label: '#' },
  { key: 'name', label: 'Nome' },
  ...STATS.map((s) => ({ key: s.key, label: s.short, title: s.label })),
  { key: 'total', label: 'Total' },
]

// Modo "Lista" (em tabela): clicar no cabeçalho de uma coluna ordena por ela (mesma ordenação do filtro)
export default function PokemonTable({
  pokemon,
  favorites,
  caught,
  sortKey,
  onSortChange,
  onSelect,
  onToggleFavorite,
  onToggleCaught,
}) {
  const sortHeader = (c) => (
    <th key={c.key} aria-sort={sortKey === c.key ? (c.key === 'id' || c.key === 'name' ? 'ascending' : 'descending') : undefined}>
      <button
        type="button"
        className={sortKey === c.key ? 'is-active' : ''}
        title={c.title ? `Ordenar por ${c.title}` : `Ordenar por ${c.label}`}
        onClick={() => onSortChange(c.key)}
      >
        {c.label}
        {sortKey === c.key && <span aria-hidden="true">{c.key === 'id' || c.key === 'name' ? ' ▲' : ' ▼'}</span>}
      </button>
    </th>
  )

  return (
    <div className="pokemon-table-wrap">
      <table className="pokemon-table">
        <thead>
          <tr>
            <th>
              <span className="visually-hidden">Coleção</span>
            </th>
            {sortHeader(COLUMNS[0])}
            {sortHeader(COLUMNS[1])}
            <th>Tipos</th>
            {COLUMNS.slice(2).map(sortHeader)}
          </tr>
        </thead>
        <tbody>
          {pokemon.map((p) => (
            <tr key={p.id}>
              <td>
                <span className="pokemon-table__icons">
                  <CaughtButton pokemon={p} isCaught={caught.includes(p.id)} onToggle={onToggleCaught} />
                  <FavoriteButton pokemon={p} isFavorite={favorites.includes(p.id)} onToggle={onToggleFavorite} />
                </span>
              </td>
              <td className="pokemon-table__num">{formatId(p.id)}</td>
              <td>
                <button
                  type="button"
                  className="pokemon-table__name"
                  onClick={() => onSelect(p.id)}
                  aria-label={`Ver detalhes de ${p.name}`}
                >
                  <PokemonImage id={p.id} name={p.name} className="pokemon-table__art" />
                  {p.name}
                </button>
              </td>
              <td>
                <span className="pokemon-table__types">
                  {typesOf(p).map((t) => (
                    <TypeBadge key={t.id} name={t.name} />
                  ))}
                </span>
              </td>
              {STATS.map((s) => (
                <td key={s.key} className="pokemon-table__num">
                  {p.stats[s.key]}
                </td>
              ))}
              <td className="pokemon-table__num">
                <strong>{totalStats(p)}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
