import typeChart from '../data/typechart.json'
import { ATTACK_TYPES, damageTaken } from './typeMatchups'
import { typesOf } from './pokemon'

export const TEAM_SIZE = 6

// Defesa do time: para cada tipo de ataque, o multiplicador em cada membro e quantos são
// fracos (>1), resistem (<1, sem contar imunes) ou são imunes (0).
// `danger` marca os tipos que o time aguenta mal: 3+ fracos, ou 2+ fracos sem ninguém para resistir.
export function teamDefense(team) {
  const perMember = team.map((p) => damageTaken(typesOf(p)))
  return ATTACK_TYPES.map((attack, i) => {
    const multipliers = perMember.map((taken) => taken[i].multiplier)
    const weak = multipliers.filter((m) => m > 1).length
    const resist = multipliers.filter((m) => m > 0 && m < 1).length
    const immune = multipliers.filter((m) => m === 0).length
    const danger = weak >= 3 || (weak >= 2 && resist + immune === 0)
    return { name: attack, multipliers, weak, resist, immune, danger }
  })
}

// Cobertura ofensiva considerando só golpes STAB (do mesmo tipo dos membros):
// o melhor multiplicador que o time consegue contra cada tipo defensor e quais tipos o alcançam.
export function teamCoverage(team) {
  const attackTypes = [...new Set(team.flatMap((p) => typesOf(p).map((t) => t.name)))].filter(
    (t) => t in typeChart,
  )
  return ATTACK_TYPES.map((defender) => {
    const best = Math.max(0, ...attackTypes.map((a) => typeChart[defender][a]))
    return {
      name: defender,
      multiplier: best,
      by: attackTypes.filter((a) => typeChart[defender][a] === best),
    }
  })
}
