import {
  Teams,
  Drivers,
  DriversOfRace,
  Races
} from '@/models/tables';

console.log('Loading Associate Model.....');



// DriversOfRace
DriversOfRace.belongsTo(Races, {
  foreignKey: 'race_id',
  as: 'race',
})
Races.hasMany(DriversOfRace, {
  foreignKey: 'race_id',
  as: 'drivers_of_race',
})
// RacesOfDriver
DriversOfRace.belongsTo(Drivers, {
  foreignKey: 'driver_id',
  as: 'driver',
})
Drivers.hasMany(DriversOfRace, {
  foreignKey: 'driver_id',
  as: 'races_of_driver',
})
// Drivers
Drivers.belongsTo(Teams, {
  foreignKey: 'team_id',
  as: 'team',
})
Teams.hasMany(Drivers, {
  foreignKey: 'team_id',
  as: 'drivers',
})