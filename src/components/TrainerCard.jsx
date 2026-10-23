import TrainerImage from './TrainerImage'
import Badges from './Badges'
import '../css/TrainerCard.css'

export default function TrainerCard({ trainer, onSelectTrainer }) {
  const teamCount = trainer.teams.length

  return (
    <article className="trainer-card">
      <button
        type="button"
        className="trainer-card__open"
        onClick={() => onSelectTrainer(trainer.id)}
        aria-label={`Ver detalhes de ${trainer.name}`}
      >
        <TrainerImage name={trainer.name} className="trainer-card__sprite" />
        <span>
          <h3>{trainer.name}</h3>
          <Badges count={trainer.badges} />
        </span>
      </button>

      <p className="trainer-card__label">
        {teamCount} {teamCount === 1 ? 'time' : 'times'}
      </p>
    </article>
  )
}
