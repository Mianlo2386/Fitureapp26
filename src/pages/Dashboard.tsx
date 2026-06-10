import { useQuery } from '@tanstack/react-query'
import { fetchAllMatches, STALE } from '../services/api'
import MatchCard from '../components/match/MatchCard'
import Skeleton from '../components/ui/Skeleton'
import type { Match } from '../types'
import { isTodayInArgentina } from '../utils/date'

export default function Dashboard() {
  const { data: matches, isLoading, isError } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchAllMatches,
    refetchInterval: 60_000,
    staleTime: STALE.MATCHES,
  })

  if (isLoading) return <Skeleton className="h-96 w-full" />
  if (isError) return <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">No se pudieron cargar los partidos. Probá recargar la página.</p>

  const todayMatches = (matches as Match[] || []).filter((m) => isTodayInArgentina(m.local_date))

  const upcoming = (matches as Match[] || []).filter((m) => m.finished !== 'TRUE' && m.time_elapsed === 'notstarted').slice(0, 6)
  const live = (matches as Match[] || []).filter((m) => m.time_elapsed !== 'notstarted' && m.finished !== 'TRUE')

  return (
    <div className="space-y-8">
      <section>
        <h1 className="mb-1 text-2xl font-bold">FixtureApp <span className="text-yellow-500">'26</span></h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Mundial 2026 — Estados Unidos, México y Canadá</p>
      </section>

      {live.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />
            En Vivo
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">{live.map((m) => <MatchCard key={m.id} match={m} />)}</div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold">
          {todayMatches.length > 0 ? 'Partidos de Hoy' : 'Próximos Partidos'}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(todayMatches.length > 0 ? todayMatches : upcoming).map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      </section>
    </div>
  )
}
