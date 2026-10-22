import '../css/Badges.css'

const BADGE_SLOTS = 8

export default function Badges({ count }) {
  const slots = Math.max(BADGE_SLOTS, count)
  return (
    <p className="badges">
      <span className="pips" aria-hidden="true">
        {Array.from({ length: slots }, (_, i) => (
          <i key={i} className={i < count ? 'on' : ''} />
        ))}
      </span>
      <span>
        {count} {count === 1 ? 'insígnia' : 'insígnias'}
      </span>
    </p>
  )
}
