import { STATS, totalStats } from './pokemon'

// Sprites de treinador do Pokémon Showdown: o arquivo é o nome em minúsculas, sem espaços nem pontuação
// ("Lt. Surge" -> ltsurge). Alguns treinadores do anime têm outro nome nos jogos.
const SPRITE_OVERRIDES = { Gary: 'blue' }

export const trainerSpriteId = (name) => SPRITE_OVERRIDES[name] ?? name.toLowerCase().replace(/[^a-z0-9]/g, '')

export const trainerSpriteUrl = (name) =>
  `https://play.pokemonshowdown.com/sprites/trainers/${trainerSpriteId(name)}.png`

// Média de cada atributo do time (arredondada)
export const teamAverages = (team) =>
  STATS.map((s) => ({
    ...s,
    value: team.length ? Math.round(team.reduce((sum, p) => sum + p.stats[s.key], 0) / team.length) : 0,
  }))

// Quantos Pokémon do time têm cada tipo, do mais frequente para o menos
export function teamTypeCounts(team, typesOf) {
  const counts = new Map()
  team.forEach((p) => typesOf(p).forEach((t) => counts.set(t.name, (counts.get(t.name) ?? 0) + 1)))
  return [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
}

export const strongestOf = (team) =>
  team.reduce((best, p) => (best === null || totalStats(p) > totalStats(best) ? p : best), null)
