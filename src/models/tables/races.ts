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
		year: {
			type: DataTypes.INTEGER,
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
