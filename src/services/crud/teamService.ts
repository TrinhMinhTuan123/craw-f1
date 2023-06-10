import { CrudService } from '../crudService.pg'
import { ICrudOption } from '@/interfaces'

import { Teams } from '@/models/tables'

import { sequelize } from '@/models'

export class TeamService extends CrudService<typeof Teams> {
	constructor() {
		super(Teams)
	}
}
