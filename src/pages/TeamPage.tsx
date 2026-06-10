import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchAllTeams, fetchAllMatches } from '../services/api'
import MatchCard from '../components/match/MatchCard'
import Skeleton from '../components/ui/Skeleton'
import type { Team, Match } from '../types'

export default function TeamPage() {
  const { id } = useParams<{ id: string }>()
  const { data: teams } = useQuery({ queryKey: ['teams'], queryFn: fetchAllTeams })
  const { data: matches } = useQuery({ queryKey: ['matches'], queryFn: fetchAllMatches })

  if (!teams || !matches) return <Skeleton className="h-96 w-full" />

  const allTeams = teams as Team[]
  const allMatches = matches as Match[]

  const team = allTeams.find((t) => t.id === id)
  if (!team) return <p className="text-gray-500">Equipo no encontrado</p>

  const teamMatches = allMatches.filter(
    (m) => m.home_team_id === id || m.away_team_id === id,
  )

  const finishedTeamMatches = teamMatches.filter((m) => m.finished === 'TRUE')
  const won = finishedTeamMatches.filter((m) => {
    if (m.home_team_id === id) return Number(m.home_score) > Number(m.away_score)
    return Number(m.away_score) > Number(m.home_score)
  }).length
  const lost = finishedTeamMatches.filter((m) => {
    if (m.home_team_id === id) return Number(m.home_score) < Number(m.away_score)
    return Number(m.away_score) < Number(m.home_score)
  }).length
  const drawn = finishedTeamMatches.length - won - lost
  let gf = 0, ga = 0
  finishedTeamMatches.forEach((m) => {
    if (m.home_team_id === id) {
      gf += Number(m.home_score) || 0
      ga += Number(m.away_score) || 0
    } else {
      gf += Number(m.away_score) || 0
      ga += Number(m.home_score) || 0
    }
  })
  const gd = gf - ga

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        {team.flag && <img src={team.flag} alt="" className="h-16 w-20 object-contain" />}
        <div>
          <h1 className="text-2xl font-bold">{team.name_en}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{team.fifa_code} · Grupo {team.groups}</p>
        </div>
      </div>

      {finishedTeamMatches.length > 0 && (
        <div className="mb-6 flex items-center gap-4 text-sm">
          <span className="text-gray-500 dark:text-gray-400">Récord:</span>
          <span className="font-medium text-green-600 dark:text-green-400">✅ {won}</span>
          <span className="font-medium text-yellow-600 dark:text-yellow-400">➖ {drawn}</span>
          <span className="font-medium text-red-600 dark:text-red-400">❌ {lost}</span>
          <span className="ml-auto text-gray-500 dark:text-gray-400">
            GF {gf} · GA {ga} · GD {gd > 0 ? `+${gd}` : gd}
          </span>
        </div>
      )}

      <h2 className="mb-3 text-lg font-semibold">Partidos</h2>
      {teamMatches.length === 0 ? (
        <p className="text-sm text-gray-500">No hay partidos registrados.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {teamMatches.map((m) => <MatchCard key={m.id} match={m} />)}
        </div>
      )}
    </div>
  )
}
