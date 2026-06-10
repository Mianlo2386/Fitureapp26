import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchAllMatches, fetchAllTeams, STALE } from '../services/api'
import { ArrowLeft } from 'lucide-react'
import Skeleton from '../components/ui/Skeleton'
import type { Match, Team } from '../types'
import { formatInArgentina } from '../utils/date'

export default function MatchDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: matches, isLoading, isError } = useQuery({ queryKey: ['matches'], queryFn: fetchAllMatches, refetchInterval: 30_000, staleTime: STALE.MATCHES })
  const { data: teams } = useQuery({ queryKey: ['teams'], queryFn: fetchAllTeams, staleTime: STALE.TEAMS })

  if (isLoading || !matches) return <Skeleton className="h-96 w-full" />
  if (isError) return <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">No se pudieron cargar los datos del partido.</p>

  const match = (matches as Match[]).find((m) => m.id === id)
  if (!match) return <p className="text-gray-500">Partido no encontrado</p>

  const allTeams = teams as Team[] || []
  const homeTeam = allTeams.find((t) => t.id === match.home_team_id)
  const awayTeam = allTeams.find((t) => t.id === match.away_team_id)

  const finished = match.finished === 'TRUE'
  const live = !finished && match.time_elapsed !== 'notstarted'

  return (
    <div className="max-w-2xl">
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        <ArrowLeft size={16} /> Volver
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 text-center">
          <span className="text-xs font-semibold uppercase text-gray-500">{match.group}</span>
          {live && <span className="ml-2 animate-pulse rounded bg-green-200 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/50 dark:text-green-300">{match.time_elapsed}'</span>}
          {finished && <span className="ml-2 rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">Finalizado</span>}
        </div>

        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            {homeTeam?.flag && <img src={homeTeam.flag} alt="" className="h-12 w-16 object-contain" />}
            <span className="text-lg font-bold">{homeTeam?.fifa_code || match.home_team_name_en}</span>
          </div>
          <div className="flex items-center gap-3 text-4xl font-bold tabular-nums">
            <span className={live || finished ? '' : 'text-gray-300 dark:text-gray-700'}>{match.home_score || '-'}</span>
            <span className="text-gray-400">:</span>
            <span className={live || finished ? '' : 'text-gray-300 dark:text-gray-700'}>{match.away_score || '-'}</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            {awayTeam?.flag && <img src={awayTeam.flag} alt="" className="h-12 w-16 object-contain" />}
            <span className="text-lg font-bold">{awayTeam?.fifa_code || match.away_team_name_en}</span>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          {formatInArgentina(match.local_date, {
            weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  )
}
