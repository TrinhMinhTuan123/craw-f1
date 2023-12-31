import { IDriverCraw } from "./driver.interface";

export interface IRaceCraw {
    grand_prix: string,
    date: string,
    href: string,
    drivers?: Array<IDriverOfRaceCraw>,
}
export interface IRace {
    id?: string,
    grand_prix: string,
    date: Date,
    year: number,
}
export interface IDriverOfRaceCraw {
    pos: number,
    no: string,
    driver_name: string,
    car: string,
    laps: number,
    time: string,
    pts: number,
    driver_info?: IDriverCraw
}
export interface IDriverOfRace {
    race_id: string,
    driver_id: string,
    pos: number,
    no: string,
    car: string,
    laps: number,
    time: string,
    pts: number,
}
export interface IYearCraw {
    year: Number,
    races: Array<IRaceCraw>,
}
