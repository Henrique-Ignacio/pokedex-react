import PokemonCard from './PokemonCard'
import '../css/PokemonList.css'

export default function PokemonList({ pokemon, favorites, onSelect, onToggleFavorite, onClear }) {
  if (pokemon.length === 0) {
    return (
      <div className="empty-state" role="status">
        <h2>Nenhum Pokémon encontrado</h2>
        <p>Tente outro nome ou ID, escolha outro tipo ou limpe os filtros.</p>
        <button type="button" className="btn btn--active" onClick={onClear}>
          Limpar filtros
        </button>
      </div>
    )
  }

  return (
    <section className="pokemon-list" aria-label="Lista de Pokémon">
      {pokemon.map((p) => (
        <PokemonCard
          key={p.id}
          pokemon={p}
          isFavorite={favorites.includes(p.id)}
          onSelect={onSelect}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </section>
  )
}
