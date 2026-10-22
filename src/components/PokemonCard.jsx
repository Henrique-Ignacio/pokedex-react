import PokemonImage from './PokemonImage'
import TypeBadge from './TypeBadge'
import { STATS, formatId, typesOf } from '../utils/pokemon'
import { colorOf } from '../utils/typeColors'
import '../css/PokemonCard.css'

export default function PokemonCard({ pokemon, isFavorite, onSelect, onToggleFavorite }) {
  const types = typesOf(pokemon)
  const accent = colorOf(types[0].name)

  return (
    <article className="pokemon-card" style={{ '--accent': accent }}>
      <button
        type="button"
        className={`pokemon-card__fav ${isFavorite ? 'is-on' : ''}`}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `Remover ${pokemon.name} dos favoritos` : `Favoritar ${pokemon.name}`}
        onClick={() => onToggleFavorite(pokemon.id)}
      >
        {isFavorite ? '★' : '☆'}
      </button>

      <button
        type="button"
        className="pokemon-card__main"
        onClick={() => onSelect(pokemon.id)}
        aria-label={`Ver detalhes de ${pokemon.name}`}
      >
        <div className="pokemon-card__art">
          <PokemonImage id={pokemon.id} name={pokemon.name} />
        </div>
        <span className="pokemon-card__id">{formatId(pokemon.id)}</span>
        <h3 className="pokemon-card__name">{pokemon.name}</h3>
        <div className="pokemon-card__types">
          {types.map((t) => (
            <TypeBadge key={t.id} name={t.name} />
          ))}
        </div>
        <dl className="pokemon-card__stats">
          {STATS.map((s) => (
            <div key={s.key} title={s.label}>
              <dt>{s.short}</dt>
              <dd>{pokemon.stats[s.key]}</dd>
            </div>
          ))}
        </dl>
      </button>
    </article>
  )
}
