import { useState } from 'react'
import { useTcgCards } from '../hooks/useTcgCards'

const PAGE_SIZE = 12

export default function TcgCards({ dexId }) {
  const { cards, loading, error } = useTcgCards(dexId)
  const [limit, setLimit] = useState(PAGE_SIZE)

  return (
    <section className="modal__cards">
      <h3>Cartas TCG {!loading && !error && <span className="muted">({cards.length})</span>}</h3>

      {loading && <p className="muted">Carregando cartas…</p>}
      {error && <p className="muted">Não foi possível carregar as cartas.</p>}
      {!loading && !error && cards.length === 0 && <p className="muted">Nenhuma carta encontrada.</p>}

      {cards.length > 0 && (
        <ul className="tcg-grid">
          {cards.slice(0, limit).map((c) => (
            <li key={c.id}>
              <a href={`${c.image}/high.webp`} target="_blank" rel="noreferrer" title={`${c.name} (${c.id})`}>
                <img src={`${c.image}/low.webp`} alt={`Carta ${c.name} (${c.id})`} loading="lazy" />
              </a>
              <span className="tcg-grid__rarity">{c.rarity === 'None' ? '—' : c.rarity}</span>
            </li>
          ))}
        </ul>
      )}

      {cards.length > limit && (
        <button type="button" className="btn" onClick={() => setLimit((l) => l + PAGE_SIZE)}>
          Ver mais ({cards.length - limit})
        </button>
      )}
    </section>
  )
}
