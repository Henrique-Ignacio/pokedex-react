import { useEffect, useMemo, useState } from 'react'
import data from './data/pokedex-data.json'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import Filters from './components/Filters'
import PokemonList from './components/PokemonList'
import PokemonDetails from './components/PokemonDetails'
import TrainerList from './components/TrainerList'
import TrainerDetails from './components/TrainerDetails'
import CompareModal from './components/CompareModal'
import TeamBuilder from './components/TeamBuilder'
import TeamList from './components/TeamList'
import { useLocalStorage } from './hooks/useLocalStorage'
import { STATS, matchesQuery, sortPokemon } from './utils/pokemon'
import { TEAM_SIZE } from './utils/teamAnalysis'
import { trainerHasPokemon } from './utils/trainers'
import './css/App.css'

const { pokemon: allPokemon, trainers, types } = data

// Só mostra no filtro os tipos que realmente aparecem nos Pokémon (ignora "Typeless")
const usedTypeIds = new Set(allPokemon.flatMap((p) => p.types.map((t) => t.id)))
const filterTypes = types.filter((t) => usedTypeIds.has(t.id))
const pokemonById = new Map(allPokemon.map((p) => [p.id, p]))

// Menor e maior valor de cada atributo nos dados: são os limites dos sliders
const statLimits = Object.fromEntries(
  STATS.map((s) => {
    const values = allPokemon.map((p) => p.stats[s.key])
    return [s.key, [Math.min(...values), Math.max(...values)]]
  }),
)

const inRange = (pokemon, ranges) =>
  STATS.every((s) => pokemon.stats[s.key] >= ranges[s.key][0] && pokemon.stats[s.key] <= ranges[s.key][1])

// Tira só a primeira ocorrência (o time pode ter o mesmo Pokémon repetido)
const withoutFirst = (list, id) => list.filter((_, i) => i !== list.indexOf(id))

// `id: null` = time novo, ainda não salvo
const newDraft = (pokemonIds = [], name = '') => ({ id: null, name, pokemonIds })
const toPokemon = (ids) => ids.map((id) => pokemonById.get(id)).filter(Boolean)

export default function App() {
  const [view, setView] = useState('pokedex')
  const [query, setQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState([])
  const [typeMode, setTypeMode] = useState('any')
  const [statRanges, setStatRanges] = useState(statLimits)
  const [caughtFilter, setCaughtFilter] = useState('all')
  const [sortKey, setSortKey] = useState('id')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [selectedTrainerId, setSelectedTrainerId] = useState(null)
  const [compareId, setCompareId] = useState(null)
  const [favorites, setFavorites] = useLocalStorage('pokedex:favorites', [])
  const [caught, setCaught] = useLocalStorage('pokedex:caught', [])
  // Times salvos ({ id, name, pokemonIds }) e o rascunho do montador (time sendo criado/editado).
  // O rascunho fica salvo também, para não perder a edição ao recarregar a página.
  const [teams, setTeams] = useLocalStorage('pokedex:teams', [])
  const [draft, setDraft] = useLocalStorage('pokedex:teamDraft', null)
  const [openTeamId, setOpenTeamId] = useState(null)
  const [viewMode, setViewMode] = useLocalStorage('pokedex:viewMode', 'grid')
  const [theme, setTheme] = useLocalStorage('pokedex:theme', 'light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Estado derivado: lista filtrada + ordenada
  const visiblePokemon = useMemo(() => {
    const hasType = (p, id) => p.types.some((t) => t.id === id)
    const filtered = allPokemon.filter(
      (p) =>
        matchesQuery(p, query) &&
        (selectedTypes.length === 0 ||
          (typeMode === 'all'
            ? selectedTypes.every((id) => hasType(p, id))
            : selectedTypes.some((id) => hasType(p, id)))) &&
        inRange(p, statRanges) &&
        (!favoritesOnly || favorites.includes(p.id)) &&
        (caughtFilter === 'all' || caught.includes(p.id) === (caughtFilter === 'caught')),
    )
    return sortPokemon(filtered, sortKey)
  }, [query, selectedTypes, typeMode, statRanges, sortKey, favoritesOnly, favorites, caughtFilter, caught])

  const toggleFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))

  const toggleCaught = (id) =>
    setCaught((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))

  // Muda os Pokémon do rascunho (se ainda não houver um, começa um time novo)
  const updateDraftMembers = (update) =>
    setDraft((prev) => {
      const current = prev ?? newDraft()
      return { ...current, pokemonIds: update(current.pokemonIds) }
    })
  const addToTeam = (id) => updateDraftMembers((ids) => (ids.length < TEAM_SIZE ? [...ids, id] : ids))
  const toggleTeamMember = (id) =>
    updateDraftMembers((ids) =>
      ids.includes(id) ? withoutFirst(ids, id) : ids.length < TEAM_SIZE ? [...ids, id] : ids,
    )
  const draftIds = draft?.pokemonIds ?? []
  const openTeam = teams.find((t) => t.id === openTeamId) ?? null

  const createTeam = () => {
    setOpenTeamId(null)
    setDraft(newDraft())
  }

  const saveDraft = () => {
    const id = draft.id ?? Date.now()
    const saved = { id, name: draft.name.trim() || 'Time sem nome', pokemonIds: draft.pokemonIds }
    setTeams((prev) => (draft.id === null ? [...prev, saved] : prev.map((t) => (t.id === id ? saved : t))))
    setDraft(null)
    setOpenTeamId(id)
  }

  const deleteTeam = () => {
    if (!window.confirm(`Excluir o time "${openTeam.name}"?`)) return
    setTeams((prev) => prev.filter((t) => t.id !== openTeam.id))
    setOpenTeamId(null)
  }

  // Vindo dos detalhes do treinador: abre o montador com uma cópia do time dele
  const analyzeTrainerTeam = (ids, name) => {
    setDraft(newDraft(ids.slice(0, TEAM_SIZE), name))
    setOpenTeamId(null)
    setSelectedTrainerId(null)
    setView('teams')
  }

  const changeView = (next) => {
    setView(next)
    // Clicar em "Times" volta para a lista (o rascunho em edição continua aberto)
    if (next === 'teams') setOpenTeamId(null)
  }

  const toggleType = (id) =>
    setSelectedTypes((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))

  const clearFilters = () => {
    setQuery('')
    setSelectedTypes([])
    setStatRanges(statLimits)
    setFavoritesOnly(false)
    setCaughtFilter('all')
  }

  const pickRandom = () => {
    const pool = visiblePokemon.length > 0 ? visiblePokemon : allPokemon
    setSelectedId(pool[Math.floor(Math.random() * pool.length)].id)
  }

  const selectedPokemon = selectedId !== null ? pokemonById.get(selectedId) : null
  const trainersOfSelected = selectedPokemon
    ? trainers.filter((t) => trainerHasPokemon(t, selectedPokemon.id))
    : []

  const selectedTrainer =
    selectedTrainerId !== null ? trainers.find((t) => t.id === selectedTrainerId) : null
  // A comparação substitui os detalhes do Pokémon (não ficam dois modais empilhados)
  const openCompare = (id) => {
    setSelectedId(null)
    setCompareId(id)
  }
  const compareBase = compareId !== null ? pokemonById.get(compareId) : null

  return (
    <div className="app">
      <Header
        view={view}
        onChangeView={changeView}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        total={allPokemon.length}
        caughtCount={caught.length}
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
              typeMode={typeMode}
              onTypeModeChange={setTypeMode}
              sortKey={sortKey}
              onSortChange={setSortKey}
              favoritesOnly={favoritesOnly}
              onToggleFavoritesOnly={() => setFavoritesOnly((v) => !v)}
              favoritesCount={favorites.length}
              caughtFilter={caughtFilter}
              onCaughtFilterChange={setCaughtFilter}
              statLimits={statLimits}
              statRanges={statRanges}
              onStatRangeChange={(key, range) => setStatRanges((prev) => ({ ...prev, [key]: range }))}
              onResetStatRanges={() => setStatRanges(statLimits)}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onRandom={pickRandom}
            />
            <PokemonList
              pokemon={visiblePokemon}
              viewMode={viewMode}
              favorites={favorites}
              caught={caught}
              sortKey={sortKey}
              onSortChange={setSortKey}
              onSelect={setSelectedId}
              onToggleFavorite={toggleFavorite}
              onToggleCaught={toggleCaught}
              onClear={clearFilters}
            />
          </>
        ) : view === 'trainers' ? (
          <TrainerList trainers={trainers} onSelectTrainer={setSelectedTrainerId} />
        ) : draft ? (
          <TeamBuilder
            editable
            name={draft.name}
            team={toPokemon(draft.pokemonIds)}
            pokemonList={allPokemon}
            onNameChange={(name) => setDraft((prev) => ({ ...prev, name }))}
            onAdd={addToTeam}
            onRemove={(index) => updateDraftMembers((ids) => ids.filter((_, i) => i !== index))}
            onSave={saveDraft}
            onCancel={() => setDraft(null)}
            onSelectPokemon={setSelectedId}
          />
        ) : openTeam ? (
          <TeamBuilder
            key={openTeam.id}
            name={openTeam.name}
            team={toPokemon(openTeam.pokemonIds)}
            onEdit={() => setDraft({ ...openTeam })}
            onDelete={deleteTeam}
            onBack={() => setOpenTeamId(null)}
            onSelectPokemon={setSelectedId}
          />
        ) : (
          <TeamList teams={teams} pokemonById={pokemonById} onOpen={setOpenTeamId} onCreate={createTeam} />
        )}
      </main>

      {selectedTrainer && (
        <TrainerDetails
          key={selectedTrainer.id}
          trainer={selectedTrainer}
          pokemonById={pokemonById}
          covered={selectedPokemon !== null || compareBase !== null}
          onClose={() => setSelectedTrainerId(null)}
          onSelectPokemon={setSelectedId}
          onAnalyzeTeam={analyzeTrainerTeam}
        />
      )}

      {selectedPokemon && (
        <PokemonDetails
          pokemon={selectedPokemon}
          pokemonById={pokemonById}
          trainers={trainersOfSelected}
          isFavorite={favorites.includes(selectedPokemon.id)}
          isCaught={caught.includes(selectedPokemon.id)}
          inTeam={draftIds.includes(selectedPokemon.id)}
          teamFull={draftIds.length >= TEAM_SIZE}
          onClose={() => setSelectedId(null)}
          onToggleFavorite={toggleFavorite}
          onToggleCaught={toggleCaught}
          onToggleTeam={toggleTeamMember}
          onCompare={openCompare}
          onSelectPokemon={setSelectedId}
        />
      )}

      {compareBase && (
        <CompareModal base={compareBase} pokemonList={allPokemon} onClose={() => setCompareId(null)} />
      )}
    </div>
  )
}
