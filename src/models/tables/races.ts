import { DataTypes } from 'sequelize'
import { sequelize, Sequelize } from '../base'

export const Races = sequelize.define(
	'tbl_races',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV1,
			primaryKey: true,
		},
		grand_prix: {
			type: DataTypes.STRING,
		},
		date: {
			type: DataTypes.DATE,
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
