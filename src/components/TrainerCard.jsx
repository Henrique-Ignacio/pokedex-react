import '../css/TrainerCard.css'

const BADGE_SLOTS = 8

export default function TrainerCard({ trainer, team, onSelectPokemon }) {
  const slots = Math.max(BADGE_SLOTS, trainer.badges)
  return (
    <article className="trainer-card">
      <header>
        <h3>{trainer.name}</h3>
        <p className="trainer-card__badges">
          <span className="pips" aria-hidden="true">
            {Array.from({ length: slots }, (_, i) => (
              <i key={i} className={i < trainer.badges ? 'on' : ''} />
            ))}
          </span>
          <span>
            {trainer.badges} {trainer.badges === 1 ? 'insígnia' : 'insígnias'}
          </span>
        </p>
      </header>

      <p className="trainer-card__label">Pokémon ({team.length})</p>
      <ul className="trainer-card__team">
        {team.map((p) => (
          <li key={p.id}>
            <button type="button" onClick={() => onSelectPokemon(p.id)}>
              {p.name}
            </button>
          </li>
        ))}
      </ul>
    </article>
  )
}
