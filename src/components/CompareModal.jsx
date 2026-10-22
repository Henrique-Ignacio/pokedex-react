import { useEffect, useState } from 'react'
import PokemonImage from './PokemonImage'
import TypeBadge from './TypeBadge'
import { STATS, formatId, matchesQuery, totalStats, typesOf } from '../utils/pokemon'
import { formatMultiplier, typeMatchups } from '../utils/typeMatchups'
import { colorOf } from '../utils/typeColors'
import '../css/PokemonDetails.css'
import '../css/CompareModal.css'

const MAX_STAT = 255

function Side({ pokemon, onChange }) {
  const types = typesOf(pokemon)
  return (
    <div className="compare__side" style={{ '--accent': colorOf(types[0].name) }}>
      <PokemonImage id={pokemon.id} name={pokemon.name} className="compare__art" />
      <span className="modal__id">{formatId(pokemon.id)}</span>
      <h2>{pokemon.name}</h2>
      <div className="modal__types">
        {types.map((t) => (
          <TypeBadge key={t.id} name={t.name} />
        ))}
      </div>
      {onChange && (
        <button type="button" className="btn compare__change" onClick={onChange}>
          Trocar
        </button>
      )}
    </div>
  )
}

function Picker({ pokemonList, excludeId, onPick }) {
  const [query, setQuery] = useState('')
  const results = pokemonList.filter((p) => p.id !== excludeId && matchesQuery(p, query))

  return (
    <div className="compare__side compare__picker">
      <input
        type="search"
        value={query}
        placeholder="Buscar Pokémon para comparar"
        aria-label="Buscar Pokémon para comparar"
        autoFocus
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {results.map((p) => (
          <li key={p.id}>
            <button type="button" onClick={() => onPick(p.id)}>
              <PokemonImage id={p.id} name={p.name} className="compare__thumb" />
              <span className="modal__id">{formatId(p.id)}</span>
              {p.name}
            </button>
          </li>
        ))}
        {results.length === 0 && <li className="muted">Nenhum Pokémon encontrado.</li>}
      </ul>
    </div>
  )
}

function StatRow({ label, a, b, max = MAX_STAT }) {
  const win = a === b ? null : a > b ? 'a' : 'b'
  return (
    <div className="compare__stat">
      <span className={`compare__value ${win === 'a' ? 'is-win' : ''}`}>{a}</span>
      <div className="compare__track compare__track--left">
        <div style={{ width: `${Math.min(100, (a / max) * 100)}%` }} className={win === 'a' ? 'is-win' : ''} />
      </div>
      <span className="compare__label">{label}</span>
      <div className="compare__track">
        <div style={{ width: `${Math.min(100, (b / max) * 100)}%` }} className={win === 'b' ? 'is-win' : ''} />
      </div>
      <span className={`compare__value ${win === 'b' ? 'is-win' : ''}`}>{b}</span>
    </div>
  )
}

function MatchupList({ items, align }) {
  if (items.length === 0) return <span className={`compare__matchup compare__matchup--${align} muted`}>—</span>
  return (
    <ul className={`compare__matchup compare__matchup--${align}`}>
      {items.map((t) => (
        <li key={t.name}>
          <TypeBadge name={t.name} />
          <span className="compare__mult">×{formatMultiplier(t.multiplier)}</span>
        </li>
      ))}
    </ul>
  )
}

const MATCHUP_ROWS = [
  { key: 'weaknesses', label: 'Fraco contra' },
  { key: 'resistances', label: 'Resiste a' },
  { key: 'immunities', label: 'Imune a' },
]

function MatchupCompare({ a, b }) {
  const ma = typeMatchups(typesOf(a))
  const mb = typeMatchups(typesOf(b))
  // "Imune a" só aparece se algum dos dois tiver imunidade
  const rows = MATCHUP_ROWS.filter((r) => r.key !== 'immunities' || ma.immunities.length + mb.immunities.length > 0)

  return (
    <section className="compare__matchups" aria-label="Fraquezas e resistências">
      <h3>Fraquezas e resistências</h3>
      {rows.map((r) => (
        <div key={r.key} className="compare__matchup-row">
          <MatchupList items={ma[r.key]} align="left" />
          <span className="compare__label">{r.label}</span>
          <MatchupList items={mb[r.key]} align="right" />
        </div>
      ))}
    </section>
  )
}

export default function CompareModal({ base, pokemonList, onClose }) {
  const [otherId, setOtherId] = useState(null)
  const other = otherId !== null ? pokemonList.find((p) => p.id === otherId) : null

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

  const wins = other ? STATS.filter((s) => base.stats[s.key] > other.stats[s.key]).length : 0
  const losses = other ? STATS.filter((s) => base.stats[s.key] < other.stats[s.key]).length : 0

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal compare"
        role="dialog"
        aria-modal="true"
        aria-label="Comparar Pokémon"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal__close" onClick={onClose} aria-label="Fechar comparação">
          ×
        </button>

        <header className="compare__header">
          <Side pokemon={base} />
          <span className="compare__vs">VS</span>
          {other ? (
            <Side pokemon={other} onChange={() => setOtherId(null)} />
          ) : (
            <Picker pokemonList={pokemonList} excludeId={base.id} onPick={setOtherId} />
          )}
        </header>

        {other && (
          <>
            <section className="compare__stats" aria-label="Atributos">
              <h3>Atributos</h3>
              {STATS.map((s) => (
                <StatRow key={s.key} label={s.label} a={base.stats[s.key]} b={other.stats[s.key]} />
              ))}
              <StatRow label="Total" a={totalStats(base)} b={totalStats(other)} max={Math.max(totalStats(base), totalStats(other))} />
              <p className="compare__summary">
                {wins === losses
                  ? `Empate: cada um vence em ${wins} de ${STATS.length} atributos.`
                  : `${wins > losses ? base.name : other.name} vence em ${Math.max(wins, losses)} de ${STATS.length} atributos.`}
              </p>
            </section>

            <MatchupCompare a={base} b={other} />
          </>
        )}
      </div>
    </div>
  )
}
