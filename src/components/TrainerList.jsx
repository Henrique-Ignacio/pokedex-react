import TrainerCard from './TrainerCard'
import '../css/TrainerList.css'

export default function TrainerList({ trainers, pokemonById, onSelectTrainer, onSelectPokemon }) {
  return (
    <section className="trainer-list" aria-label="Lista de treinadores">
      {trainers.map((trainer) => (
        <TrainerCard
          key={trainer.id}
          trainer={trainer}
          team={trainer.pokemonIds.map((id) => pokemonById.get(id)).filter(Boolean)}
          onSelectTrainer={onSelectTrainer}
          onSelectPokemon={onSelectPokemon}
        />
      ))}
    </section>
  )
}
