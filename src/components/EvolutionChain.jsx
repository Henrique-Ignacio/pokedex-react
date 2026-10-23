import PokemonImage from './PokemonImage'
import { formatId } from '../utils/pokemon'
import { evolutionChainOf, formatCondition } from '../utils/evolutions'
import '../css/EvolutionChain.css'

function Stage({ node, currentId, pokemonById, onSelect }) {
  const pokemon = pokemonById.get(node.id)
  const isCurrent = node.id === currentId

  return (
    <div className="evo__stage">
      <button
        type="button"
        className={`evo__mon ${isCurrent ? 'is-current' : ''}`}
        onClick={() => onSelect(node.id)}
        disabled={isCurrent}
        aria-current={isCurrent ? 'true' : undefined}
        aria-label={isCurrent ? pokemon.name : `Ver detalhes de ${pokemon.name}`}
      >
        <PokemonImage id={pokemon.id} name={pokemon.name} className="evo__art" />
        <span className="modal__id">{formatId(pokemon.id)}</span>
        <strong>{pokemon.name}</strong>
      </button>

      {node.evolvesTo.length > 0 && (
        <div className="evo__branches">
          {node.evolvesTo.map((child) => (
            <div key={child.id} className="evo__branch">
              <span className="evo__arrow">
                <span aria-hidden="true">→</span>
                <small>{formatCondition(child.condition)}</small>
              </span>
              <Stage node={child} currentId={currentId} pokemonById={pokemonById} onSelect={onSelect} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function EvolutionChain({ pokemon, pokemonById, onSelect }) {
  const chain = evolutionChainOf(pokemon.id)

  return (
    <section className="evo" aria-label="Cadeia de evolução">
      <h3>Evolução</h3>
      {!chain || chain.evolvesTo.length === 0 ? (
        <p className="muted">{pokemon.name} não evolui.</p>
      ) : (
        <div className="evo__scroll">
          <Stage node={chain} currentId={pokemon.id} pokemonById={pokemonById} onSelect={onSelect} />
        </div>
      )}
    </section>
  )
}
