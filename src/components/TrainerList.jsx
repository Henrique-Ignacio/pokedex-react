import TrainerCard from './TrainerCard'
import '../css/TrainerList.css'

export default function TrainerList({ trainers, onSelectTrainer }) {
  return (
    <section className="trainer-list" aria-label="Lista de treinadores">
      {trainers.map((trainer) => (
        <TrainerCard key={trainer.id} trainer={trainer} onSelectTrainer={onSelectTrainer} />
      ))}
    </section>
  )
}
