import { ErrorService } from './errorService';
import { UtilService } from "@/services/utilService";
// Crud
import { ICrudExecOption, CrudService } from './crudService';
import { ScheduleService } from './scheduleService';
import { TeamService } from './crud/teamService'
import { DriverService } from './crud/driverService';
import { DriversOfRaceService } from './crud/driversOfRaceService';
import { RacesService } from './crud/racesService';

// SECTION

const errorService = new ErrorService();
const utilService = new UtilService();
const scheduleService = new ScheduleService();
// Crud
const teamService = new TeamService()
const driverService = new DriverService()
const driversOfRaceService = new DriversOfRaceService()
const racesService = new RacesService()



// SECTION

export {
  CrudService,
  ICrudExecOption,
  utilService,
  errorService,
  scheduleService,
  teamService,
  driverService,
  racesService,
  driversOfRaceService
};
