import { useEffect, useState } from 'react'
import PokemonImage from './PokemonImage'
import TypeBadge from './TypeBadge'
import StatBar from './StatBar'
import { formatId, matchesQuery, totalStats, typesOf } from '../utils/pokemon'
import { formatMultiplier } from '../utils/typeMatchups'
import { TEAM_SIZE, teamCoverage, teamDefense } from '../utils/teamAnalysis'
import { teamAverages, teamTypeCounts } from '../utils/trainers'
import { colorOf } from '../utils/typeColors'
import '../css/PokemonDetails.css'
import '../css/TeamBuilder.css'

// Classe da célula conforme o multiplicador (cores de fraqueza/resistência na tabela)
const multiplierClass = (m) =>
  m === 0 ? 'mult--immune' : m > 1 ? `mult--weak${m >= 4 ? ' mult--x4' : ''}` : m < 1 ? `mult--resist${m <= 0.25 ? ' mult--x4' : ''}` : ''

// Modal de busca aberto pelo botão "+" de um espaço vazio
function PickerModal({ pokemonList, onPick, onClose }) {
  const [query, setQuery] = useState('')
  const results = pokemonList.filter((p) => matchesQuery(p, query))

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal team-picker"
        role="dialog"
        aria-modal="true"
        aria-labelledby="picker-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal__close" onClick={onClose} aria-label="Fechar">
          ×
        </button>
        <h3 id="picker-title">Escolher Pokémon</h3>
        <input
          type="search"
          value={query}
          placeholder="Buscar por nome ou número"
          aria-label="Buscar Pokémon para adicionar ao time"
          autoFocus
          onChange={(e) => setQuery(e.target.value)}
        />
        <ul>
          {results.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => onPick(p.id)} title={`Adicionar ${p.name}`}>
                <PokemonImage id={p.id} name={p.name} className="team-picker__thumb" />
                <span className="modal__id">{formatId(p.id)}</span>
                {p.name}
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="muted">Nenhum Pokémon encontrado.</li>}
        </ul>
      </div>
    </div>
  )
}

function DefenseTable({ team, defense }) {
  return (
    <section className="team-section" aria-label="Defesa do time">
      <h3>Defesa do time</h3>
      <p className="muted team-section__hint">
        Dano que cada membro recebe de cada tipo de ataque. Linhas destacadas são pontos fracos do time.
      </p>
      <div className="team-table-wrap">
        <table className="team-table">
          <thead>
            <tr>
              <th>Ataque</th>
              {team.map((p, i) => (
                <th key={`${p.id}-${i}`} title={p.name}>
                  <PokemonImage id={p.id} name={p.name} className="team-table__thumb" />
                </th>
              ))}
              <th>Fracos</th>
              <th>Resistem</th>
            </tr>
          </thead>
          <tbody>
            {defense.map((row) => (
              <tr key={row.name} className={row.danger ? 'is-danger' : ''}>
                <td>
                  <TypeBadge name={row.name} />
                </td>
                {row.multipliers.map((m, i) => (
                  <td key={i} className={`team-table__mult ${multiplierClass(m)}`}>
                    {m === 1 ? '' : `×${formatMultiplier(m)}`}
                  </td>
                ))}
                <td className="team-table__count">{row.weak || '–'}</td>
                <td className="team-table__count">{row.resist + row.immune || '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function TypeList({ items, empty, showBy }) {
  if (items.length === 0) return <p className="muted">{empty}</p>
  return (
    <ul className="team-types">
      {items.map((t) => (
        <li key={t.name} title={showBy && t.by.length ? `Com golpes ${t.by.join(' / ')}` : undefined}>
          <TypeBadge name={t.name} />
          {showBy && <span className="muted team-types__by">{t.by.join(', ')}</span>}
        </li>
      ))}
    </ul>
  )
}

function TeamAnalysis({ team }) {
  const defense = teamDefense(team)
  const coverage = teamCoverage(team)
  const dangers = defense.filter((d) => d.danger).sort((a, b) => b.weak - a.weak)

  return (
    <>
      <section className="team-section team-summary" aria-label="Resumo do time">
        <div>
          <h3>Pontos fracos</h3>
          <TypeList items={dangers} empty="Nenhum ponto fraco grave. Bom equilíbrio!" />
        </div>
        <div>
          <h3>Acerta super efetivo</h3>
          <TypeList items={coverage.filter((c) => c.multiplier > 1)} empty="Nenhum tipo." showBy />
        </div>
        <div>
          <h3>Sem cobertura super efetiva</h3>
          <TypeList items={coverage.filter((c) => c.multiplier <= 1)} empty="O time cobre todos os tipos!" />
        </div>
        <p className="muted team-section__hint">
          A cobertura considera só golpes do mesmo tipo dos membros (STAB) contra tipos puros.
        </p>
      </section>

      <DefenseTable team={team} defense={defense} />

      <section className="team-section team-section--split">
        <div>
          <h3>Tipos no time</h3>
          <ul className="team-types">
            {teamTypeCounts(team, typesOf).map((t) => (
              <li key={t.name}>
                <TypeBadge name={t.name} /> ×{t.count}
              </li>
            ))}
          </ul>
        </div>
        <div className="team-averages">
          <h3>Média de atributos</h3>
          {teamAverages(team).map((s) => (
            <StatBar key={s.key} label={s.label} value={s.value} color="var(--brand)" />
          ))}
          <p className="modal__total">
            Total: <strong>{Math.round(team.reduce((sum, p) => sum + totalStats(p), 0) / team.length)}</strong>
          </p>
        </div>
      </section>
    </>
  )
}

// `editable`: mostra o campo de nome, os 6 espaços (vazios com botão "+") e Salvar/Cancelar.
// Salvo: só o nome e os cards dos Pokémon que o time tem, com Editar/Excluir.
export default function TeamBuilder({
  name,
  team,
  editable,
  pokemonList,
  onNameChange,
  onAdd,
  onRemove,
  onSave,
  onCancel,
  onEdit,
  onDelete,
  onBack,
  onSelectPokemon,
}) {
  const [picking, setPicking] = useState(false)
  const slots = editable ? TEAM_SIZE : team.length

  return (
    <div className="team-builder">
      <section className="team-section">
        <div className="team-section__header">
          {editable ? (
            <input
              className="team-name-input"
              value={name}
              placeholder="Nome do time"
              aria-label="Nome do time"
              maxLength={40}
              onChange={(e) => onNameChange(e.target.value)}
            />
          ) : (
            <h2>
              {name} <span className="muted">({team.length}/{TEAM_SIZE})</span>
            </h2>
          )}
          <div className="team-section__actions">
            {editable ? (
              <>
                <button type="button" className="btn" onClick={onCancel}>
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn--active"
                  disabled={team.length === 0}
                  title={team.length === 0 ? 'Adicione pelo menos um Pokémon' : undefined}
                  onClick={onSave}
                >
                  Salvar time
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn" onClick={onBack}>
                  ← Meus times
                </button>
                <button type="button" className="btn" onClick={onEdit}>
                  Editar
                </button>
                <button type="button" className="btn btn--danger" onClick={onDelete}>
                  Excluir
                </button>
              </>
            )}
          </div>
        </div>

        <ul className="team-slots">
          {Array.from({ length: slots }, (_, i) => {
            const p = team[i]
            if (!p) {
              return (
                <li key={`empty-${i}`} className="team-slot">
                  <button
                    type="button"
                    className="team-slot--empty"
                    onClick={() => setPicking(true)}
                    aria-label="Adicionar Pokémon ao time"
                  >
                    <span aria-hidden="true">+</span>
                    Adicionar
                  </button>
                </li>
              )
            }
            return (
              // O índice entra na chave porque o time pode repetir o mesmo Pokémon (ex.: time importado de um treinador)
              <li key={`${p.id}-${i}`} className="team-slot" style={{ '--accent': colorOf(typesOf(p)[0].name) }}>
                <button
                  type="button"
                  className="team-slot__main"
                  onClick={() => onSelectPokemon(p.id)}
                  aria-label={`Ver detalhes de ${p.name}`}
                >
                  <PokemonImage id={p.id} name={p.name} className="team-slot__art" />
                  <strong>{p.name}</strong>
                  <span className="team-slot__types">
                    {typesOf(p).map((t) => (
                      <TypeBadge key={t.id} name={t.name} />
                    ))}
                  </span>
                  <span className="team-slot__total">Total {totalStats(p)}</span>
                </button>
                {editable && (
                  <button
                    type="button"
                    className="team-slot__remove"
                    onClick={() => onRemove(i)}
                    aria-label={`Tirar ${p.name} do time`}
                    title="Tirar do time"
                  >
                    ×
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      {team.length > 0 && <TeamAnalysis team={team} />}

      {picking && (
        <PickerModal
          pokemonList={pokemonList}
          onClose={() => setPicking(false)}
          onPick={(id) => {
            onAdd(id)
            setPicking(false)
          }}
        />
      )}
    </div>
  )
}
