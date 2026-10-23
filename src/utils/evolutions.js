import chains from '../data/evolutions.json'

// evolutions.json foi gerado a partir da PokéAPI (pokemon-species + evolution-chain), só com os 151 de Kanto.
// Cada nó: { id, condition?, evolvesTo: [nós] }; condition = { trigger, level?, item? } (regras de Red/Blue).

// Índice id do Pokémon -> raiz da cadeia em que ele está
const chainById = new Map()
const index = (node, root) => {
  chainById.set(node.id, root)
  node.evolvesTo.forEach((child) => index(child, root))
}
chains.forEach((root) => index(root, root))

export const evolutionChainOf = (id) => chainById.get(id) ?? null

const ITEM_NAMES = {
  'fire-stone': 'Pedra do Fogo',
  'water-stone': 'Pedra da Água',
  'thunder-stone': 'Pedra do Trovão',
  'leaf-stone': 'Pedra da Folha',
  'moon-stone': 'Pedra da Lua',
}

export function formatCondition(condition) {
  if (!condition) return ''
  if (condition.level) return `Nível ${condition.level}`
  if (condition.item) return ITEM_NAMES[condition.item] ?? condition.item
  if (condition.trigger === 'trade') return 'Troca'
  return ''
}
