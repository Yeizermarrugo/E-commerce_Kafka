const { DataTypes } = require("sequelize");
const db = require("../utils/database");

const Orders = db.define("orders", {
	id: {
		primaryKey: true,
		type: DataTypes.UUID,
		allowNull: false
	},
	user_id: {
		type: DataTypes.UUID,
		allowNull: false
	},
	items: {
		allowNull: false,
		type: DataTypes.JSONB
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

module.exports = Orders;
