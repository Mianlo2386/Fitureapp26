const BASE = 'https://worldcup26.ir'

export async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json()
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
