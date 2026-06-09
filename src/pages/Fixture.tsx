import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAllMatches } from '../services/api'
import MatchCard from '../components/match/MatchCard'
import Skeleton from '../components/ui/Skeleton'
import type { Match } from '../types'

const STAGES: { key: string; label: string; types: string[] }[] = [
  { key: 'all', label: 'Todos', types: [] },
  { key: 'group', label: 'Grupos', types: ['group'] },
  { key: 'r32', label: '16avos', types: ['r32'] },
  { key: 'r16', label: 'Octavos', types: ['r16'] },
  { key: 'qf', label: 'Cuartos', types: ['qf'] },
  { key: 'sf', label: 'Semis', types: ['sf'] },
  { key: 'final', label: 'Final', types: ['third', 'final'] },
]

const GROUP_LETTERS = 'ABCDEFGHIJKL'.split('')

export default function Fixture() {
  const [stage, setStage] = useState('all')
  const [groupFilter, setGroupFilter] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchAllMatches,
    refetchInterval: 60_000,
  })

  if (isLoading) return <Skeleton className="h-96 w-full" />

  let matches = (data as Match[]) || []

  const currentStage = STAGES.find((s) => s.key === stage)
  if (currentStage?.types.length) {
    matches = matches.filter((m) => currentStage.types.includes(m.type))
  }

  if (groupFilter) {
    matches = matches.filter((m) => m.group === groupFilter)
  }

  matches.sort((a, b) => new Date(b.local_date).getTime() - new Date(a.local_date).getTime())

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Fixture</h1>

      <div className="mb-3 flex flex-wrap gap-2">
        {STAGES.map((s) => (
          <button
            key={s.key}
            onClick={() => setStage(s.key)}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              stage === s.key
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setGroupFilter('')}
          className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition ${
            !groupFilter
              ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-900'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}
        >
          Todos
        </button>
        {GROUP_LETTERS.map((l) => (
          <button
            key={l}
            onClick={() => setGroupFilter(l)}
            className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              groupFilter === l
                ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-900'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {matches.length === 0 ? (
        <p className="text-sm text-gray-500">No hay partidos para este filtro.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">{matches.map((m) => <MatchCard key={m.id} match={m} />)}</div>
      )}
    </div>
  )
}
