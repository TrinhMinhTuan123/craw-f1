import { CrudService } from '../crudService.pg'
import { DriversOfRace } from '@/models/tables'

export class DriversOfRaceService extends CrudService<typeof DriversOfRace> {
	constructor() {
		super(DriversOfRace)
	}
}
