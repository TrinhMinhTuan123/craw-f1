import { teamService } from '@/services'
import { CrudController } from '@/controllers'
import { ICrudOption } from '@/interfaces'

export class TeamController extends CrudController<typeof teamService> {
	constructor() {
		super(teamService)
	}
	async getResultByYear(params: { year: Number, team_id: String }) {
		const result = await this.service.getResultByYear(params)
		return result
	}
}
