import { useEffect } from 'react'
import PokemonImage from './PokemonImage'
import TypeBadge from './TypeBadge'
import StatBar from './StatBar'
import TcgCards from './TcgCards'
import TypeMatchups from './TypeMatchups'
import EvolutionChain from './EvolutionChain'
import FlavorTexts from './FlavorTexts'
import { STATS, formatId, totalStats, typesOf } from '../utils/pokemon'
import { colorOf } from '../utils/typeColors'
import '../css/PokemonDetails.css'

export default function PokemonDetails({
  pokemon,
  pokemonById,
  trainers,
  isFavorite,
  isCaught,
  inTeam,
  teamFull,
  onClose,
  onToggleFavorite,
  onToggleCaught,
  onToggleTeam,
  onCompare,
  onSelectPokemon,
}) {
  // Fecha com a tecla Esc e trava o scroll do fundo enquanto o modal está aberto
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  const types = typesOf(pokemon)
  const accent = colorOf(types[0].name)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
        style={{ '--accent': accent }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal__close" onClick={onClose} aria-label="Fechar detalhes">
          ×
        </button>

        <header className="modal__hero">
          <PokemonImage id={pokemon.id} name={pokemon.name} className="modal__art" />
          <div>
            <span className="modal__id">{formatId(pokemon.id)}</span>
            <h2 id="details-title">{pokemon.name}</h2>
            <div className="modal__types">
              {types.map((t) => (
                <TypeBadge key={t.id} name={t.name} />
              ))}
            </div>
            <div className="modal__actions">
              <button
                type="button"
                className={`btn ${isFavorite ? 'btn--active' : ''}`}
                aria-pressed={isFavorite}
                onClick={() => onToggleFavorite(pokemon.id)}
              >
                {isFavorite ? '★ Favorito' : '☆ Favoritar'}
              </button>
              <button
                type="button"
                className={`btn ${isCaught ? 'btn--active' : ''}`}
                aria-pressed={isCaught}
                onClick={() => onToggleCaught(pokemon.id)}
              >
                {isCaught ? '◓ Capturado' : '◓ Marcar como capturado'}
              </button>
              <button
                type="button"
                className={`btn ${inTeam ? 'btn--active' : ''}`}
                aria-pressed={inTeam}
                disabled={!inTeam && teamFull}
                title={!inTeam && teamFull ? 'O time já tem 6 Pokémon' : undefined}
                onClick={() => onToggleTeam(pokemon.id)}
              >
                {inTeam ? '✓ No time' : '+ Time'}
              </button>
              <button type="button" className="btn" onClick={() => onCompare(pokemon.id)}>
                ⇄ Comparar
              </button>
            </div>
          </div>
        </header>

        <EvolutionChain pokemon={pokemon} pokemonById={pokemonById} onSelect={onSelectPokemon} />

        <section className="modal__stats" aria-label="Atributos">
          {STATS.map((s) => (
            <StatBar key={s.key} label={s.label} value={pokemon.stats[s.key]} color={accent} />
          ))}
          <p className="modal__total">
            Total: <strong>{totalStats(pokemon)}</strong>
          </p>
        </section>

        <TypeMatchups types={types} />

        <FlavorTexts key={pokemon.id} dexId={pokemon.id} />

        <section className="modal__trainers">
          <h3>Treinadores</h3>
          {trainers.length === 0 ? (
            <p className="muted">Nenhum treinador possui este Pokémon nos dados.</p>
          ) : (
            <ul>
              {trainers.map((t) => (
                <li key={t.id}>{t.name}</li>
              ))}
            </ul>
          )}
        </section>

        <TcgCards key={pokemon.id} dexId={pokemon.id} />
      </div>
    </div>
  )
}
