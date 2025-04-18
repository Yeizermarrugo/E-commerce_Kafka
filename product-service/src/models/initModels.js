const Products = require("./product.model");

const initModel = () => {
	Products.sync()
		.then(() => console.log("Products model synced successfully"))
		.catch((err) => console.error("Error syncing Product model:", err));
};

module.exports = initModel;
