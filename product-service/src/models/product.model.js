const { DataTypes } = require("sequelize");
const db = require("../utils/database");

const Products = db.define("productos", {
	id: {
		primaryKey: true,
		type: DataTypes.UUID,
		allowNull: false
	},
	nombre: {
		allowNull: false,
		type: DataTypes.STRING
	},
	descripcion: {
		allowNull: false,
		type: DataTypes.STRING
	},
	precio: {
		type: DataTypes.DECIMAL(15, 2),
		allowNull: false,
		defaultValue: 0
	},
	categoria: {
		allowNull: false,
		type: DataTypes.STRING
	},
	stock: {
		type: DataTypes.INTEGER,
		allowNull: false,
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

module.exports = Products;
