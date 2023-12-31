import { DataTypes } from 'sequelize'
import { sequelize, Sequelize } from '../base'

export const DriversOfRace = sequelize.define(
	'tbl_drivers_of_race',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV1,
			primaryKey: true,
		},
		race_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'tbl_races',
				key: 'id',
			},
		},
		driver_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'tbl_drivers',
				key: 'id',
			},
		},
		no: {
			type: DataTypes.STRING,
		},
		pos: {
			type: DataTypes.INTEGER,
		},
		car: {
			type: DataTypes.STRING,
		},
		laps: {
			type: DataTypes.INTEGER,
		},
		time: {
			type: DataTypes.STRING,
		},
		pts: {
			type: DataTypes.INTEGER,//point
		},
	},
	{
		hooks: {

		},
		timestamps: true,
		underscored: true,
		freezeTableName: true,
		paranoid: true,
		defaultScope: {
			attributes: { exclude: ['deletedAt'] },
		},
		scopes: {
			deleted: {
				where: { deletedAt: { $ne: null } },
				paranoid: false,
			},
		},
	},
)
