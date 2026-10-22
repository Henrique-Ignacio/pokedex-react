import { useState } from 'react'
import { artworkUrl, spriteUrl } from '../utils/pokemon'
import '../css/PokemonImage.css'

// Tenta o artwork oficial, depois o sprite pequeno e, por fim, mostra um placeholder.
export default function PokemonImage({ id, name, className = '' }) {
  const [attempt, setAttempt] = useState(0)

  if (attempt > 1) {
    return (
      <div className={`pokemon-image pokemon-image--fallback ${className}`} role="img" aria-label={name}>
        <span>?</span>
      </div>
    )
  }

  return (
    <img
      className={`pokemon-image ${className}`}
      src={attempt === 0 ? artworkUrl(id) : spriteUrl(id)}
      alt={name}
      loading="lazy"
      onError={() => setAttempt((a) => a + 1)}
    />
  )
}
