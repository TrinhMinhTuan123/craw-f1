import { ICrudOption } from '@/interfaces';
import { CrudService } from '../crudService.pg'
import { Teams, Races, DriversOfRace } from '@/models/tables'
import sequelize from 'sequelize';

export class TeamService extends CrudService<typeof Teams> {
	constructor() {
		super(Teams)
	}
	async findOrCreate(params: any, option?: ICrudOption) {
		let team = await this.model.findOne({
			where: {
				name: params.name,
				base: params.base
			},
			transaction: option.transaction
		})
		if (!team) {
			team = await this.exec(this.model.create(params, this.applyCreateOptions(option)));
		}
		return team
	}
	async getResultByYear(params: { year: Number, team_id: String }) {
		let RacesOfTeam = await DriversOfRace.findAll({//get races of a team
			where: {
				"$driver.team_id$": params.team_id
			},
			include: [
				{
					association: "driver",
					attributes: ["team_id"]

				},
			],
			attributes: ["id"]
		})
		const ListIdRacesOfTeam: Array<String> = RacesOfTeam.map((item: any) => item.id)
		const result = await DriversOfRace.findAll({
			where: {
				id: { $in: ListIdRacesOfTeam },//re-filter with races of this team
				"$race.year$": params.year

			},
			include: [
				{
					association: "race",
					attributes: { exclude: ["id", "createdAt", "updatedAt", "deletedAt"], include: ["grand_prix", "date"] }
				},
			],
			attributes: ["race_id", [sequelize.fn('sum', sequelize.col('pts')), 'pts']],
			group: ["race_id", "race.grand_prix", "race.date", "race.id"]
		})

		return result
	}
}
