import '../css/StatBar.css'

const MAX_STAT = 255 // maior valor base possível nos jogos

export default function StatBar({ label, value, color }) {
  const percent = Math.min(100, (value / MAX_STAT) * 100)
  return (
    <div className="stat-bar">
      <span className="stat-bar__label">{label}</span>
      <span className="stat-bar__value">{value}</span>
      <div
        className="stat-bar__track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={MAX_STAT}
        aria-label={label}
      >
        <div className="stat-bar__fill" style={{ width: `${percent}%`, background: color }} />
      </div>
    </div>
  )
}
