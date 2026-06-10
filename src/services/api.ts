const BASE = '/api'
const FALLBACK = 'https://corsproxy.io/?https://worldcup26.ir'

export async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (res.ok) return res.json()

  const fallbackUrl = `${FALLBACK}${path}`
  const fallbackRes = await fetch(fallbackUrl).catch(() => null)
  if (fallbackRes?.ok) return fallbackRes.json()

  throw new Error(`No se pudieron cargar los datos (${res.status})`)
}

export const STALE = {
  TEAMS: 5 * 60 * 1000,
  GROUPS: 5 * 60 * 1000,
  MATCHES: 30 * 1000,
}

export async function fetchAllTeams(): Promise<import('../types').Team[]> {
  const data = await fetchJson<{ teams: import('../types').Team[] }>('/get/teams')
  return data.teams
}

export async function fetchAllGroups(): Promise<import('../types').Group[]> {
  const data = await fetchJson<{ groups: import('../types').Group[] }>('/get/groups')
  return data.groups
}

export async function fetchAllMatches(): Promise<import('../types').Match[]> {
  const data = await fetchJson<{ games: import('../types').Match[] }>('/get/games')
  return data.games.map(m => ({
    ...m,
    home_score: m.home_score === 'null' ? '' : m.home_score,
    away_score: m.away_score === 'null' ? '' : m.away_score,
  }))
}
