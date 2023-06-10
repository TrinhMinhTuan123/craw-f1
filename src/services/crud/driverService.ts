import { CrudService } from '../crudService.pg'
import { ICrudOption } from '@/interfaces'

import { Drivers } from '@/models/tables'

import { sequelize } from '@/models'

export class DriverService extends CrudService<typeof Drivers> {
	constructor() {
		super(Drivers)
	}
}
