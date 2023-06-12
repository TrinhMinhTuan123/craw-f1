import { ITeamCraw } from "./team.interface";

export interface IDriverCraw {
    team: string,
    country: string,
    podiums: string,
    points: string,
    grands_prix_entered: string,
    world_championships: string,
    highest_race_finish: string,
    highest_grid_position: string,
    date_of_birth: string,
    place_of_birth: string,
    team_data?: ITeamCraw
}
export interface IDriver {
    id?: string,
    name: string,
    team_id: string,
    country: string,
    podiums: number,
    points: number,
    grands_prix_entered: number,
    world_championships: number,
    highest_race_finish: number,
    highest_grid_position: number,
    date_of_birth: Date,
    place_of_birth: string,
}