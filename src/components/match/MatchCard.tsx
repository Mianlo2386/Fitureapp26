import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchAllTeams } from '../../services/api'
import type { Match, Team } from '../../types'
import { formatInArgentina } from '../../utils/date'

function getStatusBadge(m: Match) {
  if (m.finished === 'TRUE') return <span className="rounded bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">Finalizado</span>
  if (m.time_elapsed !== 'notstarted') return <span className="animate-pulse rounded bg-green-200 px-2 py-0.5 text-[10px] font-medium text-green-800 dark:bg-green-900/50 dark:text-green-300">{m.time_elapsed}'</span>
  return <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Próximo</span>
}

function formatDate(dateStr: string) {
  return formatInArgentina(dateStr, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function MatchCard({ match }: { match: Match }) {
  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchAllTeams,
    staleTime: 1000 * 60 * 60,
  })

  const homeTeam = (teams as Team[] || []).find((t) => t.id === match.home_team_id)
  const awayTeam = (teams as Team[] || []).find((t) => t.id === match.away_team_id)

  return (
    <Link
      to={`/partido/${match.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="mb-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
        <span className="font-medium uppercase">{match.group}</span>
        {getStatusBadge(match)}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center justify-end gap-2 text-right">
          {homeTeam?.flag && <img src={homeTeam.flag} alt="" className="h-5 w-8 object-contain" />}
          <span className="text-sm font-medium">{homeTeam?.fifa_code || match.home_team_label || match.home_team_name_en}</span>
        </div>

        <div className="flex items-center gap-1.5 text-lg font-bold tabular-nums">
          <span className={match.finished === 'TRUE' || match.time_elapsed !== 'notstarted' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}>
            {match.home_score || '-'}
          </span>
          <span className="text-gray-400">:</span>
          <span className={match.finished === 'TRUE' || match.time_elapsed !== 'notstarted' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}>
            {match.away_score || '-'}
          </span>
        </div>

        <div className="flex flex-1 items-center gap-2">
          {awayTeam?.flag && <img src={awayTeam.flag} alt="" className="h-5 w-8 object-contain" />}
          <span className="text-sm font-medium">{awayTeam?.fifa_code || match.away_team_label || match.away_team_name_en}</span>
        </div>
      </div>

      <div className="mt-2 text-[11px] text-gray-400 dark:text-gray-600">
        {formatDate(match.local_date)}
      </div>
    </Link>
  )
}
