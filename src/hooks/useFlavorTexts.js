import { useEffect, useState } from 'react'

// flavor-texts.json foi gerado uma vez a partir da PokéAPI (pokemon-species, textos em inglês).
// Cada item: { id, entries: [{ games: ['Red', 'Blue'], text }] }, com textos iguais entre jogos agrupados.
// O arquivo é grande (~500 KB), então é importado sob demanda: o Vite o separa num pedaço próprio,
// baixado só na primeira vez que alguém abre os detalhes de um Pokémon.
let byId = null
const load = () =>
  import('../data/flavor-texts.json').then(({ default: list }) => {
    byId = new Map(list.map((p) => [p.id, p.entries]))
    return byId
  })

export function useFlavorTexts(id) {
  const [entries, setEntries] = useState(() => byId?.get(id) ?? null)

  useEffect(() => {
    if (byId) {
      setEntries(byId.get(id) ?? [])
      return
    }
    let active = true
    load().then((map) => active && setEntries(map.get(id) ?? []))
    return () => {
      active = false
    }
  }, [id])

  return { entries: entries ?? [], loading: entries === null }
}
