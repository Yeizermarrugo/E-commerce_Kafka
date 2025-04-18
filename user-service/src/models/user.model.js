const { DataTypes } = require("sequelize");
const db = require("../utils/database");

const Users = db.define("usuarios", {
	id: {
		primaryKey: true,
		type: DataTypes.UUID,
		allowNull: false
	},
	nombre: {
		allowNull: false,
		type: DataTypes.STRING
	},
	apellido: {
		allowNull: false,
		type: DataTypes.STRING
	},
	email: {
		allowNull: false,
		type: DataTypes.STRING(30),
		unique: true,
		validate: {
			isEmail: true
		}
	},
	password: {
		allowNull: false,
		type: DataTypes.STRING
	},
	telefono: {
		allowNull: false,
		type: DataTypes.STRING
	},
	createdAt: {
		type: DataTypes.DATE,
		allowNull: false,
		field: "createdAt"
	},
	updatedAt: {
		type: DataTypes.DATE,
		allowNull: false,
		field: "updatedAt"
	}
});

module.exports = Users;
