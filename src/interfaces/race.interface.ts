
export interface IRaceCraw {
    grand_prix: string,
    date: string,
    href: string,
    drivers?: Array<object>,
}
export interface IDriverOfRaceCraw {
    pos: number,
    no: string,
    driver: string,
    car: string,
    laps: number,
    time: string,
    pts: number
}
