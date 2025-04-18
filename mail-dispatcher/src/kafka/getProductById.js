const axios = require("axios");
const { getToken } = require("./auth");

const getProductById = async (product_id) => {
	const token = await getToken();
	if (!token) return null;

	try {
		const response = await axios.get(`http://product-service:3003/v1/products/${product_id}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data.data;
	} catch (error) {
		console.error("❌ Error obteniendo producto:", error.response?.data || error.message);
		return null;
	}
};

module.exports = { getProductById };
