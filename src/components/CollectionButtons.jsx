import '../css/CollectionButtons.css'

// Botões redondos de favorito e de "capturado", usados nos cards, na lista e na tabela
export function FavoriteButton({ pokemon, isFavorite, onToggle, className = '' }) {
  return (
    <button
      type="button"
      className={`icon-toggle icon-toggle--fav ${isFavorite ? 'is-on' : ''} ${className}`}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remover ${pokemon.name} dos favoritos` : `Favoritar ${pokemon.name}`}
      title={isFavorite ? 'Favorito' : 'Favoritar'}
      onClick={() => onToggle(pokemon.id)}
    >
      {isFavorite ? '★' : '☆'}
    </button>
  )
}

export function CaughtButton({ pokemon, isCaught, onToggle, className = '' }) {
  return (
    <button
      type="button"
      className={`icon-toggle icon-toggle--caught ${isCaught ? 'is-on' : ''} ${className}`}
      aria-pressed={isCaught}
      aria-label={isCaught ? `Desmarcar ${pokemon.name} como capturado` : `Marcar ${pokemon.name} como capturado`}
      title={isCaught ? 'Capturado' : 'Não capturado'}
      onClick={() => onToggle(pokemon.id)}
    >
      <img src={`${import.meta.env.BASE_URL}pokeball.png`} alt="" width="18" height="18" />
    </button>
  )
}
