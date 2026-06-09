import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAllMatches } from '../services/api'
import MatchCard from '../components/match/MatchCard'
import Skeleton from '../components/ui/Skeleton'
import { ChevronDown, ChevronRight } from 'lucide-react'
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

const PHASES: { key: string; label: string; types: string[] }[] = [
  { key: 'group', label: 'Fase de Grupos', types: ['group'] },
  { key: 'r32', label: '16avos de Final', types: ['r32'] },
  { key: 'r16', label: 'Octavos de Final', types: ['r16'] },
  { key: 'qf', label: 'Cuartos de Final', types: ['qf'] },
  { key: 'sf', label: 'Semifinales', types: ['sf'] },
  { key: 'third', label: 'Tercer Puesto', types: ['third'] },
  { key: 'final', label: 'Final', types: ['final'] },
]

const GROUP_LETTERS = 'ABCDEFGHIJKL'.split('')

function PhaseSection({
  phase,
  matches,
  defaultOpen,
}: {
  phase: string
  matches: Match[]
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  if (matches.length === 0) return null

  return (
    <section>
      <button
        onClick={() => setOpen(!open)}
        className="mb-3 flex w-full cursor-pointer items-center gap-2 text-left text-lg font-semibold text-gray-900 dark:text-white"
      >
        {open ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        {phase}
        <span className="text-sm font-normal text-gray-500">({matches.length})</span>
      </button>
      {open && (
        <div className="grid gap-3 sm:grid-cols-2">
          {matches.map((m) => <MatchCard key={m.id} match={m} />)}
        </div>
      )}
    </section>
  )
}

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

  if (groupFilter) {
    matches = matches.filter((m) => m.group === groupFilter)
  }

  matches.sort((a, b) => new Date(a.local_date).getTime() - new Date(b.local_date).getTime())

  const currentStage = STAGES.find((s) => s.key === stage)

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Fixture</h1>

      <div className="mb-3 flex flex-wrap gap-2">
        {STAGES.map((s) => (
          <button
            key={s.key}
            onClick={() => {
              setStage(s.key)
              if (s.key === 'all') setGroupFilter('')
            }}
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

      {stage === 'group' && (
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
      )}

      {stage === 'all' ? (
        <div className="space-y-6">
          {PHASES.map((ph) => {
            const phaseMatches = matches.filter((m) => ph.types.includes(m.type))
            return (
              <PhaseSection
                key={ph.key}
                phase={ph.label}
                matches={phaseMatches}
                defaultOpen={ph.key === 'group'}
              />
            )
          })}
        </div>
      ) : (
        <div className="space-y-6">
          {currentStage && (
            <PhaseSection
              phase={currentStage.label}
              matches={matches.filter((m) => currentStage.types.includes(m.type))}
              defaultOpen={true}
            />
          )}
          {matches.filter((m) => currentStage?.types.includes(m.type)).length === 0 && (
            <p className="text-sm text-gray-500">No hay partidos para este filtro.</p>
          )}
        </div>
      )}
    </div>
  )
}
