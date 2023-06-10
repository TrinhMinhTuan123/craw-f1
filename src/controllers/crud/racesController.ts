import { racesService } from '@/services'
import { CrudController } from '@/controllers'
import { ICrudOption } from '@/interfaces'

export class RacesController extends CrudController<typeof racesService> {
	constructor() {
		super(racesService)
	}
	async crawdata() {

	}
}
