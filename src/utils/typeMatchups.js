import typeChart from '../data/typechart.json'

// typechart.json foi gerado a partir de https://play.pokemonshowdown.com/data/typechart.js:
// typeChart[defensor][atacante] = multiplicador de dano que o defensor recebe (2, 1, 0.5 ou 0)
const ATTACK_TYPES = Object.keys(typeChart)

// Multiplicador de cada tipo de ataque contra o Pokémon (os dois tipos se multiplicam: ×4, ×¼…).
// Tipos fora da tabela (ex.: "Typeless") não alteram o dano.
export function damageTaken(types) {
  return ATTACK_TYPES.map((attack) => ({
    name: attack,
    multiplier: types.reduce((m, t) => m * (typeChart[t.name]?.[attack] ?? 1), 1),
  }))
}

// Agrupa em fraquezas, resistências e imunidades, do efeito mais forte para o mais fraco
export function typeMatchups(types) {
  const all = damageTaken(types)
  return {
    weaknesses: all.filter((t) => t.multiplier > 1).sort((a, b) => b.multiplier - a.multiplier),
    resistances: all.filter((t) => t.multiplier > 0 && t.multiplier < 1).sort((a, b) => a.multiplier - b.multiplier),
    immunities: all.filter((t) => t.multiplier === 0),
  }
}

export const formatMultiplier = (m) => ({ 0.25: '¼', 0.5: '½' })[m] ?? String(m)
