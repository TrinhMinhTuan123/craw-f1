import { CrudService } from '../crudService.pg'
import { Drivers } from '@/models/tables'
export class DriverService extends CrudService<typeof Drivers> {
	constructor() {
		super(Drivers)
	}
}
