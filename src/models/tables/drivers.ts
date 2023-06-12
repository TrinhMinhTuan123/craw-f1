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
		name: {
			type: DataTypes.STRING,
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
		},
		highest_race_finish: {
			type: DataTypes.INTEGER,
		},
		highest_grid_position: {
			type: DataTypes.INTEGER,
		},
		date_of_birth: {
			type: DataTypes.DATE,
		},
		place_of_birth: {
			type: DataTypes.STRING,
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
