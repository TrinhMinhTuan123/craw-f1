import { CrudService } from '../crudService.pg'
import { Teams } from '@/models/tables'

export class TeamService extends CrudService<typeof Teams> {
	constructor() {
		super(Teams)
	}
}
