import { driversOfRaceService } from '@/services'
import { CrudController } from '@/controllers'

export class DriversOfRaceController extends CrudController<typeof driversOfRaceService> {
	constructor() {
		super(driversOfRaceService)
	}
}
