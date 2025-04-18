const Users = require("./user.model");

const initModel = () => {
	Users.sync()
		.then(() => console.log("User model synced successfully"))
		.catch((err) => console.error("Error syncing User model:", err));
};

module.exports = initModel;
