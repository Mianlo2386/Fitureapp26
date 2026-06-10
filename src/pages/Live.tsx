import { useQuery } from '@tanstack/react-query'
import { fetchAllMatches, STALE } from '../services/api'
import MatchCard from '../components/match/MatchCard'
import Skeleton from '../components/ui/Skeleton'
import type { Match } from '../types'

export default function Live() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchAllMatches,
    refetchInterval: 30_000,
    staleTime: STALE.MATCHES,
  })

  if (isLoading) return <Skeleton className="h-96 w-full" />
  if (isError) return <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">No se pudieron cargar los partidos. Probá recargar la página.</p>

  const live = (data as Match[] || []).filter(
    (m) => m.time_elapsed !== 'notstarted' && m.finished !== 'TRUE',
  )
  const upcoming = (data as Match[] || []).filter(
    (m) => m.finished !== 'TRUE' && m.time_elapsed === 'notstarted',
  )

  return (
    <div className="space-y-8">
      <section>
        <h1 className="mb-1 text-2xl font-bold">En Vivo</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Actualización cada 30 segundos</p>
      </section>

      {live.length > 0 ? (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />
            Partidos en Curso ({live.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {live.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <p className="text-lg font-medium">No hay partidos en vivo ahora</p>
          <p className="mt-1 text-sm text-gray-500">Volvé durante el Mundial para ver los scores en tiempo real</p>
        </div>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Próximos Partidos</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {upcoming.slice(0, 8).map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}
    </div>
  )
}
