import { useEffect } from 'react'
import TrainerImage from './TrainerImage'
import PokemonImage from './PokemonImage'
import TypeBadge from './TypeBadge'
import StatBar from './StatBar'
import Badges from './Badges'
import { formatId, totalStats, typesOf } from '../utils/pokemon'
import { strongestOf, teamAverages, teamTypeCounts } from '../utils/trainers'
import { colorOf } from '../utils/typeColors'
import '../css/PokemonDetails.css'
import '../css/TrainerDetails.css'

// `covered` = há outro modal (detalhes de um Pokémon) aberto por cima; aí o Esc é dele
export default function TrainerDetails({ trainer, team, covered, onClose, onSelectPokemon }) {
  useEffect(() => {
    if (covered) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, covered])

  // Trava o scroll do fundo enquanto o modal está aberto
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const strongest = strongestOf(team)
  const accent = strongest ? colorOf(typesOf(strongest)[0].name) : 'var(--brand)'

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="trainer-title"
        style={{ '--accent': accent }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal__close" onClick={onClose} aria-label="Fechar detalhes">
          ×
        </button>

        <header className="modal__hero">
          <TrainerImage name={trainer.name} className="modal__art" />
          <div>
            <span className="modal__id">Treinador</span>
            <h2 id="trainer-title">{trainer.name}</h2>
            <Badges count={trainer.badges} />
            {strongest && (
              <p className="trainer-details__ace">
                Mais forte: <strong>{strongest.name}</strong> ({totalStats(strongest)})
              </p>
            )}
          </div>
        </header>

        <section>
          <h3 className="trainer-details__heading">Time ({team.length})</h3>
          {team.length === 0 ? (
            <p className="muted">Este treinador não tem Pokémon nos dados.</p>
          ) : (
            <ul className="trainer-team">
              {team.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className="trainer-team__member"
                    style={{ '--accent': colorOf(typesOf(p)[0].name) }}
                    onClick={() => onSelectPokemon(p.id)}
                    aria-label={`Ver detalhes de ${p.name}`}
                  >
                    <PokemonImage id={p.id} name={p.name} className="trainer-team__art" />
                    <span className="modal__id">{formatId(p.id)}</span>
                    <strong>{p.name}</strong>
                    <span className="trainer-team__types">
                      {typesOf(p).map((t) => (
                        <TypeBadge key={t.id} name={t.name} />
                      ))}
                    </span>
                    <span className="trainer-team__total">Total {totalStats(p)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {team.length > 0 && (
          <>
            <section>
              <h3 className="trainer-details__heading">Tipos no time</h3>
              <ul className="trainer-details__types">
                {teamTypeCounts(team, typesOf).map((t) => (
                  <li key={t.name}>
                    <TypeBadge name={t.name} /> ×{t.count}
                  </li>
                ))}
              </ul>
            </section>

            <section className="modal__stats" aria-label="Média de atributos do time">
              <h3 className="trainer-details__heading">Média do time</h3>
              {teamAverages(team).map((s) => (
                <StatBar key={s.key} label={s.label} value={s.value} color={accent} />
              ))}
            </section>
          </>
        )}
      </div>
    </div>
  )
}
