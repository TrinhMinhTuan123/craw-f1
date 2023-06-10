import { racesController, teamController } from '@/controllers'
import * as _ from 'lodash'
import { Request, Response } from '../base'
import { CrudRouter } from '../crud'
// import { blockMiddleware } from '@/middlewares'

export default class RacesRouter extends CrudRouter<typeof racesController> {
	constructor() {
		super(racesController)
	}
	customRouting() {
		this.router.get('/craw', this.crawdataMiddleware(), this.route(this.create))
	}
	async crawdata(req: Request, res: Response) {
		const result = await this.controller.crawdata()
		this.onSuccess(res, result)
	}
	crawdataMiddleware(): any[] {
		// return [blockMiddleware.run()]
		return []

	}
}
