
export interface ITeamCraw {
    full_team_name: string,
    base: string,
    team_chief: string,
    technical_chief: string,
    chassis: string,
    power_unit: string,
    first_team_entry: string,
    world_championships: string,
    highest_race_finish: string,
    pole_positions: string,
    fastest_laps: string
}
export interface ITeam {
    id?: string,
    name: string,
    base: string,
    team_chief: string,
    technical_chief: string,
    chassis: string,
    power_unit: string,
    first_team_entry: number,
    world_championships: number,
    highest_race_finish: number,
    pole_positions: number,
    fastest_laps: number
}
