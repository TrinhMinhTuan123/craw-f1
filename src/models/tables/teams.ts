import { DataTypes } from 'sequelize'
import { sequelize, Sequelize } from '../base'

export const Teams = sequelize.define(
	'tbl_teams',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV1,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
		},
		base: {
			type: DataTypes.STRING,
		},
		team_chief: {
			type: DataTypes.STRING,
		},
		technical_chief: {
			type: DataTypes.STRING,
		},
		chassis: {
			type: DataTypes.STRING,
		},
		power_unit: {
			type: DataTypes.STRING,
		},
		first_team_entry: {
			type: DataTypes.INTEGER,
		},
		world_championships: {
			type: DataTypes.INTEGER,
		},
		highest_race_finish: {
			type: DataTypes.INTEGER,
		},
		pole_positions: {
			type: DataTypes.INTEGER,
		},
		fastest_laps: {
			type: DataTypes.INTEGER,
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
