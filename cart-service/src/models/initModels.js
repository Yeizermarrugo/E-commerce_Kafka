const CartItem = require("./cart.model");

const initModel = () => {
	CartItem.sync()
		.then(() => console.log("CartItems model synced successfully"))
		.catch((err) => console.error("Error syncing CartItem model:", err));
};

module.exports = initModel;
