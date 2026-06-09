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

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        {team.flag && <img src={team.flag} alt="" className="h-16 w-20 object-contain" />}
        <div>
          <h1 className="text-2xl font-bold">{team.name_en}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{team.fifa_code} · Grupo {team.groups}</p>
        </div>
      </div>

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
