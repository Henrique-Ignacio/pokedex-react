import { useState } from 'react'
import { useFlavorTexts } from '../hooks/useFlavorTexts'
import '../css/FlavorTexts.css'

// Descrições da Pokédex de cada jogo: uma por vez com setas, ou todas de uma vez em "Ver todas"
export default function FlavorTexts({ dexId }) {
  const { entries, loading } = useFlavorTexts(dexId)
  const [index, setIndex] = useState(0)
  const [showAll, setShowAll] = useState(false)

  if (loading) {
    return (
      <section className="flavor">
        <h3>Descrições da Pokédex</h3>
        <p className="muted">Carregando descrições…</p>
      </section>
    )
  }
  if (entries.length === 0) return null

  const current = entries[index]

  return (
    <section className="flavor" aria-label="Descrições da Pokédex">
      <div className="flavor__header">
        <h3>
          Descrições da Pokédex <span className="muted">({entries.length})</span>
        </h3>
        <button type="button" className="btn flavor__toggle" onClick={() => setShowAll((v) => !v)}>
          {showAll ? 'Ver uma por vez' : 'Ver todas'}
        </button>
      </div>

      {showAll ? (
        <ul className="flavor__list">
          {entries.map((e) => (
            <li key={e.games.join()} className="flavor__entry">
              <span className="flavor__games">{e.games.join(' / ')}</span>
              <p>{e.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flavor__single">
          <button
            type="button"
            className="flavor__nav"
            onClick={() => setIndex((i) => (i - 1 + entries.length) % entries.length)}
            aria-label="Descrição anterior"
          >
            ‹
          </button>
          <div className="flavor__entry" aria-live="polite">
            <span className="flavor__games">
              {current.games.join(' / ')}
              <span className="muted">
                {' '}
                · {index + 1}/{entries.length}
              </span>
            </span>
            <p>{current.text}</p>
          </div>
          <button
            type="button"
            className="flavor__nav"
            onClick={() => setIndex((i) => (i + 1) % entries.length)}
            aria-label="Próxima descrição"
          >
            ›
          </button>
        </div>
      )}
    </section>
  )
}
