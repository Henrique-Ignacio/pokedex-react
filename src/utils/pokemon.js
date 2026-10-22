export const STATS = [
  { key: 'hp', label: 'HP', short: 'HP' },
  { key: 'attack', label: 'Attack', short: 'ATK' },
  { key: 'defense', label: 'Defense', short: 'DEF' },
  { key: 'specialAttack', label: 'Special Attack', short: 'SpA' },
  { key: 'specialDefense', label: 'Special Defense', short: 'SpD' },
  { key: 'speed', label: 'Speed', short: 'SPD' },
]

export const SORT_OPTIONS = [
  { value: 'id', label: 'Número (ID)' },
  { value: 'name', label: 'Nome (A–Z)' },
  ...STATS.map((s) => ({ value: s.key, label: `${s.label} (maior primeiro)` })),
]

export const formatId = (id) => `#${String(id).padStart(3, '0')}`

export const totalStats = (pokemon) =>
  STATS.reduce((sum, s) => sum + pokemon.stats[s.key], 0)

// Imagens oficiais da PokéAPI (opcional, documentado no README).
// O app continua funcionando sem elas: há um fallback visual.
export const artworkUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
export const spriteUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

// Pesquisa por ID (número, com ou sem "#") ou por parte do nome
export function matchesQuery(pokemon, rawQuery) {
  const q = rawQuery.trim().toLowerCase().replace('#', '')
  if (!q) return true
  if (/^\d+$/.test(q)) return pokemon.id === Number(q)
  return pokemon.name.toLowerCase().includes(q)
}

export function sortPokemon(list, sortKey) {
  const copy = [...list]
  if (sortKey === 'id') return copy.sort((a, b) => a.id - b.id)
  if (sortKey === 'name') return copy.sort((a, b) => a.name.localeCompare(b.name))
  return copy.sort((a, b) => b.stats[sortKey] - a.stats[sortKey] || a.id - b.id)
}

// No arquivo de dados o Mew vem sem tipos; mostramos "Typeless" (tipo 0 do próprio JSON) nesse caso.
export const typesOf = (pokemon) =>
  pokemon.types.length > 0 ? pokemon.types : [{ id: 0, name: 'Typeless' }]
