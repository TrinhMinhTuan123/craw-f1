import { ICrudOption } from '@/interfaces';
import { CrudService } from '../crudService.pg'
import { Drivers, DriversOfRace } from '@/models/tables'
import sequelize from 'sequelize';

export class DriverService extends CrudService<typeof Drivers> {
	constructor() {
		super(Drivers)
	}
	async findOrCreate(params: any, option?: ICrudOption) {
		let driver = await this.model.findOne({
			where: {
				team_id: params.team_id,
				name: params.name,
				country: params.country
			},
			transaction: option.transaction
		})
		if (!driver) {
			driver = await this.exec(this.model.create(params, this.applyCreateOptions(option)));
		}
		return driver
	}
	async getResultADriverByYear(params: { year: Number, driver_id: String }) {
		const result = await DriversOfRace.findAll({
			where: {
				"$race.year$": params.year,
				"$driver.id$": params.driver_id
			},
			include: [
				{
					association: "race",
					attributes: ["grand_prix", "date"]
				},
				{
					association: "driver",
					attributes: []
				}
			],
			attributes: ["car", "pos", [sequelize.fn('sum', sequelize.col('pts')), 'pts']],
			group: ["race_id", "race.grand_prix", "race.date", "driver.id", "car", "pos"],
			// order: [["pts", "desc"]],
			raw: true
		})
		return result
	}
	async getResultAllDriverByYear(params: { year: Number }) {
		let driversOfRaceAYear: any = await DriversOfRace.findAll({//get races of a team
			where: {
				"$race.year$": params.year
			},
			include: [
				{
					association: "driver",
					attributes: ["id", "name", "country"],
				},
				{
					association: "race",
					attributes: ["year"],
				},
			],
			attributes: ["car", [sequelize.fn('sum', sequelize.col('pts')), 'pts']],
			group: ["driver.id", "race.year", "car"],
			order: [["pts", "desc"]],
			raw: true
		})
		for (let index = 0; index < driversOfRaceAYear.length; index++) {
			const item = driversOfRaceAYear[index]
			const apiGetResultATeamByYear: string = `/api/v1/drivers/${item["driver.id"]}/get-result-by-year/${params.year}`
			item.detail = apiGetResultATeamByYear
		}
		return driversOfRaceAYear
	}
}
