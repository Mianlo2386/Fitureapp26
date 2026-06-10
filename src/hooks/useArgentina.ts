import { useQuery } from '@tanstack/react-query'
import { fetchAllTeams, fetchAllMatches, fetchAllGroups, STALE } from '../services/api'
import type { Team, Match, Group } from '../types'
import { parseApiDate } from '../utils/date'

const ARG_FIFA_CODE = 'ARG'

export function useArgentina() {
  const { data: teams } = useQuery({ queryKey: ['teams'], queryFn: fetchAllTeams, staleTime: STALE.TEAMS })
  const { data: matches } = useQuery({ queryKey: ['matches'], queryFn: fetchAllMatches, staleTime: STALE.MATCHES })
  const { data: groups } = useQuery({ queryKey: ['groups'], queryFn: fetchAllGroups, staleTime: STALE.GROUPS })

  const allTeams = (teams as Team[]) || []
  const allMatches = (matches as Match[]) || []
  const allGroups = (groups as Group[]) || []

  const team = allTeams.find((t) => t.fifa_code === ARG_FIFA_CODE)
  const teamId = team?.id

  const argentinaMatches = teamId
    ? allMatches.filter((m) => m.home_team_id === teamId || m.away_team_id === teamId)
    : []

  const lastMatch = argentinaMatches
    .filter((m) => m.finished === 'TRUE')
    .sort((a, b) => parseApiDate(b.local_date).getTime() - parseApiDate(a.local_date).getTime())[0]

  const nextMatch = argentinaMatches
    .filter((m) => m.finished !== 'TRUE' && m.time_elapsed === 'notstarted')
    .sort((a, b) => parseApiDate(a.local_date).getTime() - parseApiDate(b.local_date).getTime())[0]

  const liveMatch = argentinaMatches.find((m) => m.time_elapsed !== 'notstarted' && m.finished !== 'TRUE')

  const finishedMatches = argentinaMatches.filter((m) => m.finished === 'TRUE')
  const won = finishedMatches.filter((m) => {
    if (m.home_team_id === teamId) return Number(m.home_score) > Number(m.away_score)
    return Number(m.away_score) > Number(m.home_score)
  }).length
  const lost = finishedMatches.filter((m) => {
    if (m.home_team_id === teamId) return Number(m.home_score) < Number(m.away_score)
    return Number(m.away_score) < Number(m.home_score)
  }).length
  const drawn = finishedMatches.length - won - lost

  let gf = 0, ga = 0
  finishedMatches.forEach((m) => {
    if (m.home_team_id === teamId) {
      gf += Number(m.home_score) || 0
      ga += Number(m.away_score) || 0
    } else {
      gf += Number(m.away_score) || 0
      ga += Number(m.home_score) || 0
    }
  })

  const groupLetter = team?.groups || ''
  const currentGroup = allGroups.find((g) => g.name === groupLetter)

  const sortedMatches = [...argentinaMatches].sort(
    (a, b) => parseApiDate(a.local_date).getTime() - parseApiDate(b.local_date).getTime()
  )

  const last5 = sortedMatches
    .filter((m) => m.finished === 'TRUE')
    .slice(-5)
    .map((m) => {
      const isHome = m.home_team_id === teamId
      const homeScore = Number(m.home_score) || 0
      const awayScore = Number(m.away_score) || 0
      if (isHome ? homeScore > awayScore : awayScore > homeScore) return 'win' as const
      if (homeScore === awayScore) return 'draw' as const
      return 'loss' as const
    })

  return {
    team,
    teamId,
    matches: argentinaMatches,
    nextMatch,
    lastMatch,
    liveMatch,
    stats: { played: finishedMatches.length, won, lost, drawn, gf, ga, gd: gf - ga },
    groupLetter,
    currentGroup: currentGroup || null,
    last5,
  }
}
