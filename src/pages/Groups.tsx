import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAllGroups, STALE } from '../services/api'
import GroupTable from '../components/group/GroupTable'
import Skeleton from '../components/ui/Skeleton'
import type { Group } from '../types'

const GROUP_LETTERS = 'ABCDEFGHIJKL'.split('')

export default function Groups() {
  const [selected, setSelected] = useState('A')
  const { data: groups, isLoading: loadingG, isError } = useQuery({ queryKey: ['groups'], queryFn: fetchAllGroups, staleTime: STALE.GROUPS })

  if (loadingG) return <Skeleton className="h-96 w-full" />
  if (isError) return <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">No se pudieron cargar los grupos.</p>

  const allGroups = groups as Group[]

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Grupos</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        {GROUP_LETTERS.map((l) => (
          <button
            key={l}
            onClick={() => setSelected(l)}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              selected === l
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            Grupo {l}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 text-lg font-bold">Grupo {selected}</h2>
        <GroupTable group={selected} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allGroups.map((g) => (
          <div
            key={g.name}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <GroupTable group={g.name} />
          </div>
        ))}
      </div>
    </div>
  )
}
