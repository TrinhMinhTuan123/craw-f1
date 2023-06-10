import { DataTypes } from 'sequelize'
import { sequelize, Sequelize } from '../base'

export const Drivers = sequelize.define(
	'tbl_drivers',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV1,
			primaryKey: true,
		},
		team_id: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'tbl_teams',
				key: 'id',
			},
		},
		country: {
			type: DataTypes.STRING,
		},
		podiums: {
			type: DataTypes.INTEGER,
		},
		points: {
			type: DataTypes.INTEGER,
		},
		grands_prix_entered: {
			type: DataTypes.INTEGER,
		},
		world_championships: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		highest_race_finish: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		highest_grid_position: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		fastest_laps: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		date_of_birth: {
			type: DataTypes.DATE,
		},
		place_of_birth: {
			type: DataTypes.STRING,
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
