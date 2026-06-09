export interface Match {
  _id: string
  id: string
  home_team_id: string
  away_team_id: string
  home_score: string
  away_score: string
  home_scorers: string | null
  away_scorers: string | null
  group: string
  matchday: string
  local_date: string
  stadium_id: string
  finished: string
  time_elapsed: string
  type: string
  home_team_name_en: string
  home_team_name_fa: string
  away_team_name_en: string
  away_team_name_fa: string
  home_team_label?: string
  away_team_label?: string
}

export interface GroupStanding {
  team_id: string
  pts: string
  gf: string
  ga: string
}

export interface Group {
  name: string
  teams: GroupStanding[]
}

export interface Team {
  id: string
  name_en: string
  name_fa: string
  fifa_code: string
  groups: string
  flag: string
}

export interface Stadium {
  id: string
  name_en: string
  fifa_name: string
  city_en: string
  country_en: string
  capacity: number
}
