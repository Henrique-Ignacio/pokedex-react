import { useState } from 'react'
import { trainerSpriteUrl } from '../utils/trainers'
import '../css/TrainerImage.css'

// Sprite do Pokémon Showdown; se não existir, mostra a inicial do treinador.
export default function TrainerImage({ name, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`trainer-image trainer-image--fallback ${className}`} role="img" aria-label={name}>
        <span>{name[0]}</span>
      </div>
    )
  }

  return (
    <img
      className={`trainer-image ${className}`}
      src={trainerSpriteUrl(name)}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
