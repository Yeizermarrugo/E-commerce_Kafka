const axios = require("axios");

let authToken = null;
let tokenExpiry = null;

const loginToUserService = async () => {
	try {
		const response = await axios.post("http://user-service:7000/v1/auth/login", {
			email: process.env.SERVICE_EMAIL || "mail-dispatcher@service.com",
			password: process.env.SERVICE_PASSWORD || "mail-dispatcher"
		});
		authToken = response.data.data; // el token JWT
		tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // casi 1 día
		console.log("✅ Token obtenido desde auth/login");
		return authToken;
	} catch (error) {
		console.error("❌ Error obteniendo token de login:", error.response?.data || error.message);
		return null;
	}
};

const getToken = async () => {
	// si no hay token o está expirando pronto, renovarlo
	if (!authToken || Date.now() > tokenExpiry) {
		await loginToUserService();
	}
	return authToken;
};

module.exports = {
	getToken
};
