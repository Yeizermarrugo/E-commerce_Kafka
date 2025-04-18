const { DataTypes } = require("sequelize");
const db = require("../utils/database");

const CartItem = db.define("cart_item", {
	id: {
		primaryKey: true,
		type: DataTypes.UUID,
		allowNull: false
	},
	user_id: {
		type: DataTypes.UUID,
		allowNull: false
	},
	product_id: {
		allowNull: false,
		type: DataTypes.UUID
	},
	quantity: {
		allowNull: false,
		type: DataTypes.INTEGER
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

module.exports = CartItem;
