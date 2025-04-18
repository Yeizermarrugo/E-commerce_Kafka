const Orders = require("./order.model");

const initModel = () => {
	Orders.sync()
		.then(() => console.log("Orders model synced successfully"))
		.catch((err) => console.error("Error syncing Order model:", err));
};

module.exports = initModel;
