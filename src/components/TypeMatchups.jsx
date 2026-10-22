import TypeBadge from './TypeBadge'
import { formatMultiplier, typeMatchups } from '../utils/typeMatchups'
import '../css/TypeMatchups.css'

function MatchupRow({ title, items, empty }) {
  return (
    <div className="matchups__row">
      <h4>{title}</h4>
      {items.length === 0 ? (
        <p className="muted">{empty}</p>
      ) : (
        <ul>
          {items.map((t) => (
            <li key={t.name}>
              <TypeBadge name={t.name} />
              <span className="matchups__mult">×{formatMultiplier(t.multiplier)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function TypeMatchups({ types }) {
  const { weaknesses, resistances, immunities } = typeMatchups(types)

  return (
    <section className="matchups" aria-label="Fraquezas e resistências">
      <h3>Fraquezas e resistências</h3>
      <MatchupRow title="Fraco contra" items={weaknesses} empty="Nenhuma fraqueza." />
      <MatchupRow title="Resiste a" items={resistances} empty="Nenhuma resistência." />
      {immunities.length > 0 && <MatchupRow title="Imune a" items={immunities} />}
    </section>
  )
}
