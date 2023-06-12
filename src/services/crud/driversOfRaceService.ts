import { ICrudOption } from '@/interfaces';
import { CrudService } from '../crudService.pg'
import { DriversOfRace } from '@/models/tables'

export class DriversOfRaceService extends CrudService<typeof DriversOfRace> {
	constructor() {
		super(DriversOfRace)
	}
	async findOrCreate(params: any, option?: ICrudOption) {
		let driverOfRace = await this.model.findOne({
			where: {
				race_id: params.race_id,
				driver_id: params.driver_id,
			},
			transaction: option.transaction
		})
		if (!driverOfRace) {
			driverOfRace = await this.exec(this.model.create(params, this.applyCreateOptions(option)));
		}
		return driverOfRace
	}
}
