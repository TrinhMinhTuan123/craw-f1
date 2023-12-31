import { driverService, driversOfRaceService, racesService, teamService } from '@/services'
import { CrudController } from '@/controllers'
import { ICrudOption, IDriverOfRace, IDriverOfRaceCraw, IRace, IRaceCraw, ITeam, ITeamCraw, IYearCraw } from '@/interfaces'
import axios from 'axios';
import { IDriver, IDriverCraw } from '@/interfaces/driver.interface';
const cheerio = require('cheerio');
import {
	sequelize
} from '@/models'
import * as moment from "moment";
const schedule = require("node-schedule");


export class RacesController extends CrudController<typeof racesService> {
	constructor() {
		super(racesService)
		schedule.scheduleJob('0 0 */1 */1 *', async () => {//sync data everyday
			this.syncData()
		});
	}
	// async chuckAsyncData() {
	// 	const rangeYears: Array<Number> = await this.getRangeOfYears()
	// 	let n, m, temparray: Array<Number>, chunk = 20;
	// 	for (n = 0, m = rangeYears.length; n < m; n += chunk) {
	// 		temparray = rangeYears.slice(n, n + chunk);
	// 		await this.syncData(temparray)
	// 	}
	// }

	async syncData() {
		const transaction = await sequelize.transaction();
		try {

			let rangeYears: Array<Number> = await this.getRangeOfYears()
			// const fullDataCraw = await Promise.all(
			// 	years
			// 		.sort((a: any, b: any) => a.index - b.index)
			// 		.map((year: number) => this.crawdata(year))
			// );//parallel
			const lastRace: any = await this.service.getItem({
				attributes: ["year"],
				order: [["year", "DESC"]],
				transaction
			})//save to db
			const lastYear: Number = lastRace.year
			const lastYearInF1: Number = rangeYears[0]
			if (lastYear < lastYearInF1) {//get data for new years
				const indexOfLastYear: number = rangeYears.indexOf(lastYear)
				rangeYears = rangeYears.slice(0, indexOfLastYear)
			} else {
				rangeYears = []
			}
			console.log("rangeYears ", rangeYears)
			if (rangeYears.length > 0) {
				console.log(`in sync : ${rangeYears[0]} => ${rangeYears[rangeYears.length - 1]}`)
				await driversOfRaceService.delete({ where: {}, transaction })
				await this.service.delete({ where: {}, transaction })
				await driverService.delete({ where: {}, transaction })
				await teamService.delete({ where: {}, transaction })
				for (let y = 0; y < rangeYears.length; y++) {
					const year: Number = rangeYears[y]
					const dataCraw: IYearCraw = await this.crawdata(year)
					// const dataCraw: IYearCraw = fullDataCraw[y]
					const yearSeason = dataCraw;
					let bodyRace: IRace = null
					for (let r = 0; r < yearSeason.races.length; r++) {
						const racesInYear = yearSeason.races[r];
						bodyRace = {
							grand_prix: racesInYear.grand_prix,
							date: new Date(moment(racesInYear.date, "DD MMM YYYY").add(12, "hours").valueOf()),
							year: moment(racesInYear.date, "DD MMM YYYY").year()
						}
						const raceItem: any = await this.service.findOrCreate(bodyRace, { transaction })//save to db
						let bodyDriverOfRace: IDriverOfRace = null
						for (let d = 0; d < racesInYear.drivers.length; d++) {
							const driverOfRace = racesInYear.drivers[d];
							//create team
							const bodyTeam = await this.convertDataCrawedToPrimaryTeam(driverOfRace.driver_info.team_data)
							const teamItem: any = await teamService.findOrCreate(bodyTeam, { transaction })//save to db
							//create driver
							const bodyDriver: IDriver = await this.convertDataCrawedToPrimaryDriver(driverOfRace.driver_info, teamItem.id, driverOfRace.driver_name)
							const driverItem: any = await driverService.findOrCreate(bodyDriver, { transaction })//save to db
							//create driver of race
							bodyDriverOfRace = {
								race_id: raceItem.id,
								driver_id: driverItem.id,
								pos: isNaN(driverOfRace.pos) ? 9999 : driverOfRace.pos,
								no: driverOfRace.no,
								car: driverOfRace.car,
								laps: isNaN(driverOfRace.laps) ? null : driverOfRace.laps,
								time: driverOfRace.time,
								pts: isNaN(driverOfRace.pts) ? 0 : driverOfRace.pts,
							}
							await driversOfRaceService.findOrCreate(bodyDriverOfRace, { transaction })//save to db
							console.log(`saved data to db:${bodyRace.year}, ${bodyRace.grand_prix}, ${bodyDriver.name}, ${bodyTeam.name}`)
						}
					}
					console.log("sync done year: ", yearSeason.year)
				}
				transaction.commit();
			} else {
				console.log(`no new data to sync: latest data on F1 is ${lastYearInF1} and latest data on server is ${lastYear}`)
			}
			// return { sync: "ok" }
		} catch (error) {
			console.log(error);
			transaction.rollback();
			throw error;
		}
	}
	async crawdata(year: Number) {
		console.log("getting data: ", year)
		const url = `https://www.formula1.com/en/results/jcr:content/resultsarchive.html/${year}/races.html`
		const html = await axios.get(url)
		const $ = cheerio.load(html.data, { xmlMode: true });
		const racesInYear: Array<IRaceCraw> = $("tr").map((i: number, element: any) => ({
			grand_prix: $(element).find('td:nth-of-type(2)').text().trim(),//grand_prix
			date: $(element).find('td:nth-of-type(3)').text().trim(),//date
			href: $(element).find('td:nth-of-type(2) a').attr('href')
		})).get()
		racesInYear.shift()
		const tempDataTeam: any = {}//used to avoid searching for the same team many times(without driver info case)
		for (let y = 0; y < racesInYear.length; y++) {
			const race: IRaceCraw = racesInYear[y];
			const url: string = `https://www.formula1.com/${race.href}`.replace("results.html", "results/jcr:content/resultsarchive.html")
			const html = await axios.get(url)
			const $ = cheerio.load(html.data, { xmlMode: true });
			const driversOfrace: Array<IDriverOfRaceCraw> = []
			for (let x = 0; x < $("tr").length; x++) {
				const element = $("tr")[x];
				const pos: number = isNaN($(element).find('td:nth-of-type(2)').text().trim()) ? 9999 : parseInt($(element).find('td:nth-of-type(2)').text().trim())//pos is NC
				const laps: number = isNaN($(element).find('td:nth-of-type(6)').text().trim()) ? null : parseInt($(element).find('td:nth-of-type(6)').text().trim())//laps is null
				const pts: number = isNaN($(element).find('td:nth-of-type(8)').text().trim()) ? 0 : parseInt($(element).find('td:nth-of-type(8)').text().trim())
				const nameOfCar: string = $(element).find('td:nth-of-type(5)').text().trim()
				const driver: IDriverOfRaceCraw = {
					pos: pos,
					no: $(element).find('td:nth-of-type(3)').text().trim(),
					driver_name: $(element).find('td:nth-of-type(4) .hide-for-tablet').text().trim() + " " + $(element).find('td:nth-of-type(4) .hide-for-mobile').text().trim(),
					car: nameOfCar,
					laps: laps,
					time: $(element).find('td:nth-of-type(7)').text().trim(),
					pts: pts,
				}
				if (driver.driver_name !== " ") {
					let driverInfo: IDriverCraw = await this.crawDrivers(driver.driver_name)
					if (!driverInfo) {//without driver info
						driverInfo = {
							team: nameOfCar,
							country: "GLOBAL",
							podiums: "N/A",
							points: "N/A",
							grands_prix_entered: "N/A",
							world_championships: "N/A",
							highest_race_finish: "1 (x0)",
							highest_grid_position: "N/A",
							date_of_birth: null,
							place_of_birth: null,
						}
						const team_id = nameOfCar.replace(/ /g, "-")
						try {//trying to find team info when without driver info
							if (tempDataTeam.hasOwnProperty(team_id)) {
								driverInfo.team_data = tempDataTeam[team_id]
							} else {
								console.log("trying find team again")
								const pathOfTeam = `/en/teams/${team_id}.html`
								let dataCrawTeam: ITeamCraw = await this.crawTeam(pathOfTeam)
								if (!dataCrawTeam.hasOwnProperty("full_team_name")) {
									dataCrawTeam = {
										full_team_name: nameOfCar,
										base: "GLOBAL",
										team_chief: null,
										technical_chief: null,
										chassis: null,
										power_unit: null,
										first_team_entry: "0",
										world_championships: "N/A",
										highest_race_finish: "1 (x0)",
										pole_positions: "N/A",
										fastest_laps: "N/A"
									}
								}
								tempDataTeam[team_id] = dataCrawTeam
								driverInfo.team_data = dataCrawTeam
							}
						} catch (error) {
							// console.log("error ", error.message)
							// console.log("team not found: ", nameOfCar)
							driverInfo.team_data = {
								full_team_name: nameOfCar,
								base: "GLOBAL",
								team_chief: null,
								technical_chief: null,
								chassis: null,
								power_unit: null,
								first_team_entry: "0",
								world_championships: "N/A",
								highest_race_finish: "1 (x0)",
								pole_positions: "N/A",
								fastest_laps: "N/A"
							}
							tempDataTeam[team_id] = driverInfo.team_data
						}
					}
					driver.driver_info = driverInfo
				}
				driversOfrace.push(driver)
			}
			driversOfrace.shift()
			race.drivers = driversOfrace
		}
		const result: IYearCraw = {
			year,
			races: racesInYear
		}
		console.log("crawed: ", year)
		return result
	}
	async getRangeOfYears() {
		const url = 'https://www.formula1.com/en/results/jcr:content/resultsarchive.html/2023/races.html'
		const html = await axios.get(url)
		const $ = cheerio.load(html.data, { xmlMode: true });
		const rangeYears: Array<Number> = [];
		$('[data-name="year"]').each((i: number, el: any) => {
			const year: Number = parseInt($(el).text().trim())
			rangeYears.push(year)
		});
		return rangeYears
	}
	async crawDrivers(name: string) {
		const id: string = name.toLowerCase().replace(/ /g, "-")
		const url = `https://www.formula1.com/en/drivers/${id}.html`
		let html = null
		let driver: IDriverCraw = null
		let path: string = null
		try {
			html = await axios.get(url)
			const $ = cheerio.load(html.data, { xmlMode: true });
			const dataCraw: any = {}
			const numberOfimageInPage: number = $(".fom-adaptiveimage").length
			if (numberOfimageInPage > 0) {
				$("tr").each((i: number, element: any) => {
					const key = $(element).find('th:nth-of-type(1)').text().trim().toLowerCase().replace(/ /g, "_")
					const value = $(element).find('td:nth-of-type(1)').text().trim()
					dataCraw[key] = value
				})
				driver = dataCraw
				for (let index = 0; index < $(".selected-article").length; index++) {
					const element = $(".selected-article")[index];
					const aliasHref = $(element).find('a').attr('href')
					if (aliasHref.includes("en/teams")) {
						path = aliasHref//path info team
						break
					}
				}
			}
		} catch (error) {
			path = null
			return null
		}
		if (path) {
			const dataCrawTeam: ITeamCraw = await this.crawTeam(path)
			driver.team_data = dataCrawTeam
		}
		return driver
	}
	async crawTeam(path: string) {
		const url = `https://www.formula1.com/${path}`
		const html = await axios.get(url)
		const $ = cheerio.load(html.data, { xmlMode: true });
		let dataCraw: any = {}
		const numberOfBrandLogo: number = $(".brand-logo").length
		if (numberOfBrandLogo > 0) {
			$("tr").each((i: number, element: any) => {
				const key = $(element).find('th:nth-of-type(1)').text().trim().toLowerCase().replace(/ /g, "_")
				const value = $(element).find('td:nth-of-type(1)').text().trim()
				dataCraw[key] = value
			})
		}
		const team: ITeamCraw = dataCraw
		return team
	}
	convertDataCrawedToPrimaryTeam(body: ITeamCraw) {
		let team_highest_race_finish: number = null
		if (body.highest_race_finish) {
			const driver_highest_race_finish_cut_first: string = body.highest_race_finish.replace("1 (x", "")
			team_highest_race_finish = parseInt(driver_highest_race_finish_cut_first.replace(")", ""))
		}
		const bodyTeam: ITeam = {
			name: body.full_team_name,
			base: body.base,
			team_chief: body.team_chief,
			technical_chief: body.technical_chief,
			chassis: body.chassis,
			power_unit: body.power_unit,
			first_team_entry: parseInt(body.first_team_entry),
			world_championships: body.world_championships === "N/A" ? null : parseInt(body.world_championships),
			highest_race_finish: team_highest_race_finish,
			pole_positions: body.pole_positions === "N/A" ? null : parseInt(body.pole_positions),
			fastest_laps: body.fastest_laps === "N/A" ? null : parseInt(body.fastest_laps),
		}
		return bodyTeam
	}
	convertDataCrawedToPrimaryDriver(body: IDriverCraw, team_id: string, name: string) {
		let driver_highest_race_finish: number = null
		if (body.highest_race_finish) {
			const driver_highest_race_finish_cut_first: string = body.highest_race_finish.replace("1 (x", "")
			driver_highest_race_finish = parseInt(driver_highest_race_finish_cut_first.replace(")", ""))
		}
		const bodyDriver: IDriver = {
			team_id,
			name,
			country: body.country,
			podiums: body.podiums === "N/A" ? null : parseInt(body.podiums),
			points: body.points === "N/A" ? null : parseInt(body.points),
			grands_prix_entered: body.grands_prix_entered === "N/A" ? null : parseInt(body.grands_prix_entered),
			world_championships: body.world_championships === "N/A" ? null : parseInt(body.world_championships),
			highest_race_finish: driver_highest_race_finish,
			highest_grid_position: body.highest_grid_position === "N/A" ? null : parseInt(body.highest_grid_position),
			date_of_birth: body.date_of_birth ? new Date(moment(body.date_of_birth, "DD/MM/YYYY").add(12, "hours").valueOf()) : null,
			place_of_birth: body.place_of_birth,
		}
		return bodyDriver
	}
}
