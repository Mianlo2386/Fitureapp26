import { useQuery } from '@tanstack/react-query'
import { fetchAllMatches } from '../services/api'
import MatchCard from '../components/match/MatchCard'
import Skeleton from '../components/ui/Skeleton'
import type { Match } from '../types'

const ROUNDS = [
  { key: 'r32', label: '16avos de Final' },
  { key: 'r16', label: 'Octavos de Final' },
  { key: 'qf', label: 'Cuartos de Final' },
  { key: 'sf', label: 'Semifinales' },
  { key: 'third', label: 'Tercer Puesto' },
  { key: 'final', label: 'Final' },
] as const

export default function Bracket() {
  const { data: matches, isLoading: mLoad } = useQuery({ queryKey: ['matches'], queryFn: fetchAllMatches })

  if (mLoad) return <Skeleton className="h-96 w-full" />

  const allMatches = (matches as Match[]) || []

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Llaves</h1>

      <div className="space-y-8">
        {ROUNDS.map(({ key, label }) => {
          const roundMatches = allMatches.filter((m) => m.type === key)
          if (roundMatches.length === 0) return null

          return (
            <section key={key}>
              <h2 className="mb-3 text-lg font-semibold">{label}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {roundMatches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
