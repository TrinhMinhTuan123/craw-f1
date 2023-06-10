import {
  Teams,
  Drivers,
} from '@/models/tables';

console.log('Loading Associate Model.....');


// Drivers
Drivers.belongsTo(Teams, {
  foreignKey: 'team_id',
  as: 'team',
})
Teams.hasMany(Drivers, {
  foreignKey: 'team_id',
  as: 'drivers',
})