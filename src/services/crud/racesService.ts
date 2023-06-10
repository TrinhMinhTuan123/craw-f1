import { CrudService } from '../crudService.pg'
import { Races } from '@/models/tables'

export class RacesService extends CrudService<typeof Races> {
	constructor() {
		super(Races)
	}
}
