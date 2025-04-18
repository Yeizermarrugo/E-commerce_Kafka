const axios = require("axios");
const { getToken } = require("./auth");

const getUserById = async (userId) => {
	const token = await getToken();
	if (!token) return null;

	try {
		const response = await axios.get(`http://user-service:7000/v1/users/${userId}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data.data;
	} catch (error) {
		console.error("❌ Error obteniendo usuario:", error.response?.data || error.message);
		return null;
	}
};

module.exports = { getUserById };
