import { CrudController } from './crudController';
import { TeamController } from './crud/teamController'
import { DriverController } from './crud/driverController';


// SECTION

// Crud
const teamController = new TeamController()
const driverController = new DriverController()


// SECTION

export {
  CrudController,
  teamController,
  driverController
};
