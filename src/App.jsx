import { useEffect, useMemo, useState } from 'react'
import data from './data/pokedex-data.json'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import Filters from './components/Filters'
import PokemonList from './components/PokemonList'
import PokemonDetails from './components/PokemonDetails'
import TrainerList from './components/TrainerList'
import { useLocalStorage } from './hooks/useLocalStorage'
import { matchesQuery, sortPokemon } from './utils/pokemon'
import './css/App.css'

const { pokemon: allPokemon, trainers, types } = data

// Só mostra no filtro os tipos que realmente aparecem nos Pokémon (ignora "Typeless")
const usedTypeIds = new Set(allPokemon.flatMap((p) => p.types.map((t) => t.id)))
const filterTypes = types.filter((t) => usedTypeIds.has(t.id))
const pokemonById = new Map(allPokemon.map((p) => [p.id, p]))

export default function App() {
  const [view, setView] = useState('pokedex')
  const [query, setQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState([])
  const [sortKey, setSortKey] = useState('id')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [favorites, setFavorites] = useLocalStorage('pokedex:favorites', [])
  const [theme, setTheme] = useLocalStorage('pokedex:theme', 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Estado derivado: lista filtrada + ordenada
  const visiblePokemon = useMemo(() => {
    const filtered = allPokemon.filter(
      (p) =>
        matchesQuery(p, query) &&
        (selectedTypes.length === 0 || p.types.some((t) => selectedTypes.includes(t.id))) &&
        (!favoritesOnly || favorites.includes(p.id)),
    )
    return sortPokemon(filtered, sortKey)
  }, [query, selectedTypes, sortKey, favoritesOnly, favorites])

  const toggleFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))

  const toggleType = (id) =>
    setSelectedTypes((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))

  const clearFilters = () => {
    setQuery('')
    setSelectedTypes([])
    setFavoritesOnly(false)
  }

  const pickRandom = () => {
    const pool = visiblePokemon.length > 0 ? visiblePokemon : allPokemon
    setSelectedId(pool[Math.floor(Math.random() * pool.length)].id)
  }

  const selectedPokemon = selectedId !== null ? pokemonById.get(selectedId) : null
  const trainersOfSelected = selectedPokemon
    ? trainers.filter((t) => t.pokemonIds.includes(selectedPokemon.id))
    : []

  return (
    <div className="app">
      <Header
        view={view}
        onChangeView={setView}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        total={allPokemon.length}
        shown={visiblePokemon.length}
      />

      <main>
        {view === 'pokedex' ? (
          <>
            <SearchBar value={query} onChange={setQuery} />
            <Filters
              types={filterTypes}
              selectedTypes={selectedTypes}
              onToggleType={toggleType}
              onClearTypes={() => setSelectedTypes([])}
              sortKey={sortKey}
              onSortChange={setSortKey}
              favoritesOnly={favoritesOnly}
              onToggleFavoritesOnly={() => setFavoritesOnly((v) => !v)}
              favoritesCount={favorites.length}
              onRandom={pickRandom}
            />
            <PokemonList
              pokemon={visiblePokemon}
              favorites={favorites}
              onSelect={setSelectedId}
              onToggleFavorite={toggleFavorite}
              onClear={clearFilters}
            />
          </>
        ) : (
          <TrainerList trainers={trainers} pokemonById={pokemonById} onSelectPokemon={setSelectedId} />
        )}
      </main>

      {selectedPokemon && (
        <PokemonDetails
          pokemon={selectedPokemon}
          trainers={trainersOfSelected}
          isFavorite={favorites.includes(selectedPokemon.id)}
          onClose={() => setSelectedId(null)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  )
}
