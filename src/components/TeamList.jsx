import PokemonImage from './PokemonImage'
import { TEAM_SIZE } from '../utils/teamAnalysis'
import '../css/TeamBuilder.css'

// Página "Times": todos os times salvos. Clicar em um abre o time; "Novo time" abre o montador.
export default function TeamList({ teams, pokemonById, onOpen, onCreate }) {
  return (
    <div className="team-builder">
      <div className="team-section__header">
        <h2 className="team-list__title">Meus times</h2>
        <button type="button" className="btn btn--active" onClick={onCreate}>
          + Novo time
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="empty-state" role="status">
          <h2>Nenhum time criado</h2>
          <p>Crie um time do zero ou importe o time de um treinador pelos detalhes dele.</p>
        </div>
      ) : (
        <ul className="team-list">
          {teams.map((t) => {
            const members = t.pokemonIds.map((id) => pokemonById.get(id)).filter(Boolean)
            return (
              <li key={t.id}>
                <button type="button" className="team-list__card" onClick={() => onOpen(t.id)}>
                  <span className="team-list__header">
                    <strong>{t.name}</strong>
                    <span className="muted">
                      {members.length}/{TEAM_SIZE}
                    </span>
                  </span>
                  <span className="team-list__members">
                    {members.map((p, i) => (
                      <PokemonImage key={`${p.id}-${i}`} id={p.id} name={p.name} className="team-list__thumb" />
                    ))}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
