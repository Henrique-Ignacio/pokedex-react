// Cores associadas a cada tipo (usadas em badges, cards e barras)
export const TYPE_COLORS = {
  Normal: '#A8A77A',
  Fire: '#EE8130',
  Water: '#6390F0',
  Electric: '#F7D02C',
  Grass: '#7AC74C',
  Ice: '#96D9D6',
  Fighting: '#C22E28',
  Poison: '#A33EA1',
  Ground: '#E2BF65',
  Flying: '#A98FF3',
  Psychic: '#F95587',
  Bug: '#A6B91A',
  Rock: '#B6A136',
  Ghost: '#735797',
  Dragon: '#6F35FC',
  Dark: '#705746',
  Steel: '#B7B7CE',
  Fairy: '#D685AD',
  Typeless: '#888888',
}

// Tipos com fundo claro usam texto escuro; os demais usam texto branco (contraste)
const DARK_TEXT_TYPES = new Set([
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Ground',
  'Flying', 'Psychic', 'Bug', 'Rock', 'Steel', 'Fairy',
])

export const colorOf = (typeName) => TYPE_COLORS[typeName] ?? TYPE_COLORS.Typeless
export const textOn = (typeName) => (DARK_TEXT_TYPES.has(typeName) ? '#10131c' : '#ffffff')
