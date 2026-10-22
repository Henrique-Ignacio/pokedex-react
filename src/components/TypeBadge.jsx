import { colorOf, textOn } from '../utils/typeColors'
import '../css/TypeBadge.css'

export default function TypeBadge({ name }) {
  return (
    <span className="type-badge" style={{ background: colorOf(name), color: textOn(name) }}>
      {name}
    </span>
  )
}
