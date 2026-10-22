import { useEffect, useState } from 'react'

// O endpoint REST de listagem não devolve a raridade; o GraphQL devolve tudo numa requisição só
const GRAPHQL = 'https://api.tcgdex.net/v2/graphql'
const QUERY = 'query ($dexId: Int) { cards(filters: { dexId: $dexId }) { id name image rarity } }'

// Da mais rara para a mais comum (nomes exatamente como em /v2/en/rarities).
// Raridades fora desta lista vão para o fim.
const RARITY_ORDER = [
  'Mega Hyper Rare', 'Hyper rare', 'Special illustration rare', 'Crown', 'Shiny Ultra Rare',
  'Secret Rare', 'Illustration rare', 'Three Star', 'Two Shiny', 'Ultra Rare', 'Full Art Trainer',
  'Two Star', 'Shiny rare VMAX', 'Shiny rare V', 'Shiny rare', 'One Shiny', 'One Star',
  'Amazing Rare', 'Radiant Rare', 'Rare Holo LV.X', 'LEGEND', 'Rare PRIME',
  'Holo Rare VSTAR', 'Holo Rare VMAX', 'Holo Rare V', 'Double rare', 'ACE SPEC Rare',
  'Four Diamond', 'Black White Rare', 'Futuristic Rare', 'Pikachu Rare', 'Classic Collection',
  'Holo Rare', 'Rare Holo', 'Rare', 'Three Diamond', 'Uncommon', 'Two Diamond',
  'Common', 'One Diamond', 'Promo', 'None',
]
const rank = (rarity) => {
  const i = RARITY_ORDER.indexOf(rarity)
  return i === -1 ? RARITY_ORDER.length : i
}

// Cache em memória: reabrir o mesmo Pokémon não refaz a requisição
const cache = new Map()

// Busca na TCGdex todas as cartas de um Pokémon pelo número da Pokédex, ordenadas por raridade
export function useTcgCards(dexId) {
  const [state, setState] = useState(() =>
    cache.has(dexId) ? { cards: cache.get(dexId), loading: false, error: null } : { cards: [], loading: true, error: null },
  )

  useEffect(() => {
    if (cache.has(dexId)) {
      setState({ cards: cache.get(dexId), loading: false, error: null })
      return
    }

    const controller = new AbortController()
    setState({ cards: [], loading: true, error: null })

    fetch(GRAPHQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { dexId } }),
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(({ data, errors }) => {
        if (errors) throw new Error(errors[0].message)
        // Algumas cartas não têm imagem na API; descartamos essas
        const cards = data.cards.filter((c) => c.image).sort((a, b) => rank(a.rarity) - rank(b.rarity))
        cache.set(dexId, cards)
        setState({ cards, loading: false, error: null })
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ cards: [], loading: false, error: err })
      })

    return () => controller.abort()
  }, [dexId])

  return state
}
