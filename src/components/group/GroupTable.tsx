import { useQuery } from '@tanstack/react-query'
import { fetchAllGroups, fetchAllTeams } from '../../services/api'
import type { Team, GroupStanding, Group as GroupType } from '../../types'
import Skeleton from '../ui/Skeleton'

function getTeamInfo(teams: Team[], id: string) {
  return teams.find((t) => t.id === id)
}

function groupRow(
  t: GroupStanding,
  teams: Team[],
  idx: number,
) {
  const info = getTeamInfo(teams, t.team_id)
  const pts = Number.parseInt(t.pts) || 0
  const gf = Number.parseInt(t.gf) || 0
  const ga = Number.parseInt(t.ga) || 0
  const gd = gf - ga

  return (
    <tr key={t.team_id} className={`border-b border-gray-100 text-sm dark:border-gray-800 ${idx < 2 ? 'font-medium text-green-700 dark:text-green-400' : ''}`}>
      <td className="py-2">{idx + 1}</td>
      <td className="flex items-center gap-2 py-2">
        {info?.flag && <img src={info.flag} alt="" className="h-4 w-6 object-contain" />}
        <span className="truncate">{info?.fifa_code || t.team_id}</span>
      </td>
      <td className="py-2 text-center">{pts}</td>
      <td className="py-2 text-center">{gf}</td>
      <td className="py-2 text-center">{ga}</td>
      <td className="py-2 text-center">{gd > 0 ? `+${gd}` : gd}</td>
    </tr>
  )
}

export default function GroupTable({ group }: { group: string }) {
  const { data: groups, isLoading: loadingG } = useQuery({
    queryKey: ['groups'],
    queryFn: fetchAllGroups,
  })
  const { data: teams, isLoading: loadingT } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchAllTeams,
  })

  if (loadingG || loadingT) return <Skeleton className="h-48 w-full" />

  const g = (groups as GroupType[])?.find((x) => x.name === group)
  if (!g) return <p className="text-sm text-gray-500">Sin datos</p>

  const sorted = [...g.teams].sort((a, b) => {
    const ptsA = Number.parseInt(a.pts) || 0
    const ptsB = Number.parseInt(b.pts) || 0
    if (ptsB !== ptsA) return ptsB - ptsA
    const gdA = (Number.parseInt(a.gf) || 0) - (Number.parseInt(a.ga) || 0)
    const gdB = (Number.parseInt(b.gf) || 0) - (Number.parseInt(b.ga) || 0)
    return gdB - gdA
  })

  return (
    <table className="w-full text-left">
      <thead>
        <tr className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-500">
          <th className="w-6 py-1">#</th>
          <th>Equipo</th>
          <th className="w-8 text-center">Pts</th>
          <th className="w-8 text-center">GF</th>
          <th className="w-8 text-center">GA</th>
          <th className="w-8 text-center">GD</th>
        </tr>
      </thead>
      <tbody>{sorted.map((t, i) => groupRow(t, (teams as Team[]) || [], i))}</tbody>
    </table>
  )
}
