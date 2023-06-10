import { racesService } from '@/services'
import { CrudController } from '@/controllers'
import { ICrudOption, IDriverOfRaceCraw, IRaceCraw } from '@/interfaces'
import axios from 'axios';
import { IDriverCraw } from '@/interfaces/driver.interface';
const cheerio = require('cheerio');
const request = require('request');
export class RacesController extends CrudController<typeof racesService> {
	constructor() {
		super(racesService)
	}
	async crawdata() {
		const rangeYears: Array<Number> = await this.getRangeYears()
		const result: Array<object> = []
		for (let index = 0; index < 1; index++) {
			const year = rangeYears[index];
			const url = `https://www.formula1.com/en/results/jcr:content/resultsarchive.html/${year}/races.html`
			const html = await axios.get(url)
			const $ = cheerio.load(html.data, { xmlMode: true });
			const racesInYear: Array<IRaceCraw> = $("tr").map((i: number, element: any) => ({
				grand_prix: $(element).find('td:nth-of-type(2)').text().trim(),//grand_prix
				date: $(element).find('td:nth-of-type(3)').text().trim(),//date
				href: $(element).find('td:nth-of-type(2) a').attr('href')
			})).get()
			racesInYear.shift()

			for (let y = 0; y < racesInYear.length; y++) {
				const race: IRaceCraw = racesInYear[y];
				const url: string = `https://www.formula1.com/${race.href}`.replace("results.html", "results/jcr:content/resultsarchive.html")
				const html = await axios.get(url)
				const $ = cheerio.load(html.data, { xmlMode: true });
				const driversOfrace: Array<IDriverOfRaceCraw> = $("tr").map((i: number, element: any) => ({
					pos: parseInt($(element).find('td:nth-of-type(2)').text().trim()),
					no: $(element).find('td:nth-of-type(3)').text().trim(),
					driver: $(element).find('td:nth-of-type(4) .hide-for-tablet').text().trim() + " " + $(element).find('td:nth-of-type(4) .hide-for-mobile').text().trim(),
					car: $(element).find('td:nth-of-type(5)').text().trim(),
					laps: parseInt($(element).find('td:nth-of-type(6)').text().trim()),
					time: $(element).find('td:nth-of-type(7)').text().trim(),
					pts: parseInt($(element).find('td:nth-of-type(8)').text().trim()),


				})).get()
				driversOfrace.shift()
				race.drivers = driversOfrace
			}
			const item = {
				year,
				races: racesInYear
			}
			result.push(item)
		}
		return result
	}


	async getRangeYears() {
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
		const html = await axios.get(url)
		const $ = cheerio.load(html.data, { xmlMode: true });
		const dataCraw: any = {}
		$("tr").each((i: number, element: any) => {
			const key = $(element).find('th:nth-of-type(1)').text().trim().toLowerCase().replace(/ /g, "_")
			const value = $(element).find('td:nth-of-type(1)').text().trim()
			dataCraw[key] = value
		})
		const driver: IDriverCraw = dataCraw
		const path: string = $(".selected-article").find('a').attr('href')
		const dataCrawTeam: any = await this.crawTeam(path)
		driver.team_data = dataCrawTeam
		return driver
	}
	async crawTeam(path: string) {
		const url = `https://www.formula1.com/${path}`
		const html = await axios.get(url)
		const $ = cheerio.load(html.data, { xmlMode: true });
		const team: any = {}
		$("tr").each((i: number, element: any) => {
			const key = $(element).find('th:nth-of-type(1)').text().trim().toLowerCase().replace(/ /g, "_")
			const value = $(element).find('td:nth-of-type(1)').text().trim()
			team[key] = value
		})
		return team
	}
}
