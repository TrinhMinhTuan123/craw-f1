import { teamController } from '@/controllers'
import * as _ from 'lodash'
import { Request, Response } from '../base'
import { CrudRouter } from '../crud'

export default class TeamRouter extends CrudRouter<typeof teamController> {
	constructor() {
		super(teamController)
	}
	customRouting() {
		this.router.get('/:team_id/get-result-by-year/:year', this.route(this.getResultByYear))
	}
	async getResultByYear(req: Request, res: Response) {
		const year: Number = parseInt(req.params.year)
		const team_id: String = req.params.team_id

		const result = await this.controller.getResultByYear({ year, team_id })//test with latest year
		this.onSuccess(res, result)
	}
}
