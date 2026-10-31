// Slider de faixa (mínimo e máximo) feito com dois <input type="range"> sobrepostos,
// já que o HTML não tem um slider duplo nativo.
export default function RangeSlider({ label, min, max, value, onChange }) {
  const [low, high] = value
  const percent = (v) => ((v - min) / (max - min)) * 100

  return (
    <div className="range-slider">
      <div className="range-slider__header">
        <span>{label}</span>
        <span className="range-slider__values">
          {low} – {high}
        </span>
      </div>
      <div className="range-slider__control">
        <div className="range-slider__track">
          <div
            className="range-slider__fill"
            style={{ left: `${percent(low)}%`, right: `${100 - percent(high)}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={low}
          aria-label={`${label} mínimo`}
          // Quando os dois pontos se encontram perto do fim, o de mínimo fica por cima para poder ser arrastado
          style={{ zIndex: low > (min + max) / 2 ? 2 : 1 }}
          onChange={(e) => onChange([Math.min(Number(e.target.value), high), high])}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={high}
          aria-label={`${label} máximo`}
          onChange={(e) => onChange([low, Math.max(Number(e.target.value), low)])}
        />
      </div>
    </div>
  )
}
