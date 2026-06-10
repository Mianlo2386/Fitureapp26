import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { fetchAllMatches, STALE } from '../services/api'
import { useArgentina } from '../hooks/useArgentina'
import MatchCard from '../components/match/MatchCard'
import GroupTable from '../components/group/GroupTable'
import Skeleton from '../components/ui/Skeleton'
import type { Match } from '../types'
import { isTodayInArgentina } from '../utils/date'

export default function Dashboard() {
  const [argOpen, setArgOpen] = useState(false)
  const argentina = useArgentina()
  const argentinaMatchIds = new Set(argentina.matches.map((m) => m.id))
  const { data: matches, isLoading, isError } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchAllMatches,
    refetchInterval: 60_000,
    staleTime: STALE.MATCHES,
  })

  if (isLoading) return <Skeleton className="h-96 w-full" />
  if (isError) return <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">No se pudieron cargar los partidos. Probá recargar la página.</p>

  const todayMatches = (matches as Match[] || []).filter(
    (m) => isTodayInArgentina(m.local_date) && !argentinaMatchIds.has(m.id),
  )

  const upcoming = (matches as Match[] || []).filter(
    (m) => m.finished !== 'TRUE' && m.time_elapsed === 'notstarted' && !argentinaMatchIds.has(m.id),
  ).slice(0, 6)
  const live = (matches as Match[] || []).filter(
    (m) => m.time_elapsed !== 'notstarted' && m.finished !== 'TRUE' && !argentinaMatchIds.has(m.id),
  )

  const featuredMatch = argentina.liveMatch || argentina.nextMatch || argentina.lastMatch

  return (
    <div className="space-y-8">
      <section>
        <h1 className="mb-1 text-2xl font-bold">FixtureApp <span className="text-yellow-500">'26</span></h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Mundial 2026 — Estados Unidos, México y Canadá</p>
      </section>

      {argentina.team && (
        <section className="rounded-xl border border-sky-200 bg-gradient-to-r from-sky-50 to-white dark:border-sky-900/50 dark:from-sky-950/30 dark:to-gray-950">
          <button
            onClick={() => setArgOpen(!argOpen)}
            className="flex w-full cursor-pointer items-center gap-2 px-4 pt-4 pb-3 text-left"
          >
            {argOpen ? <ChevronDown size={20} className="text-sky-500" /> : <ChevronRight size={20} className="text-sky-500" />}
            <span className="text-xl">🇦🇷</span>
            <h2 className="text-lg font-bold">Argentina</h2>
            {argentina.liveMatch && (
              <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                En vivo
              </span>
            )}
          </button>

          {argOpen && (
            <div className="px-4 pb-4">
              {featuredMatch && (
                <div className="mb-4">
                  <MatchCard match={featuredMatch} highlight />
                </div>
              )}

              {argentina.stats.played > 0 && (
                <div className="mb-4 flex items-center gap-4 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Récord:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">✅ {argentina.stats.won}</span>
                  <span className="font-medium text-yellow-600 dark:text-yellow-400">➖ {argentina.stats.drawn}</span>
                  <span className="font-medium text-red-600 dark:text-red-400">❌ {argentina.stats.lost}</span>
                  <span className="ml-auto text-gray-500 dark:text-gray-400">
                    GF {argentina.stats.gf} · GA {argentina.stats.ga} · GD {argentina.stats.gd > 0 ? `+${argentina.stats.gd}` : argentina.stats.gd}
                  </span>
                </div>
              )}

              {argentina.groupLetter && (
                <GroupTable group={argentina.groupLetter} />
              )}
            </div>
          )}
        </section>
      )}

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
