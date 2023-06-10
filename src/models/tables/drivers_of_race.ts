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
			type: DataTypes.INTEGER,//minute
		},
		pts: {
			type: DataTypes.INTEGER,//point
		},
		created_at: {
			type: 'TIMESTAMP',
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull: false,
		},
		updated_at: {
			type: 'TIMESTAMP',
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull: false,
		},
		deleted_at: { type: 'TIMESTAMP' },
	},
	{
		hooks: {

		},
		timestamps: true,
		underscored: true,
		freezeTableName: true,
		paranoid: true,
		defaultScope: {
			attributes: { exclude: ['deleted_at'] },
		},
		scopes: {
			deleted: {
				where: { deleted_at: { $ne: null } },
				paranoid: false,
			},
		},
	},
)
