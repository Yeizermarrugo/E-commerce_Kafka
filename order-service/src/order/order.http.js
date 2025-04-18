const orderController = require("./order.controller");
const responses = require("../utils/handleResponses");

const getAll = (req, res) => {
	if (!req.userId) {
		throw new Error("User not authenticated");
	}
	const userId = req.userId;
	orderController
		.getAllOrders(userId)
		.then((data) => {
			responses.success({
				status: 200,
				data: data,
				message: "Getting all Products",
				res
			});
		})
		.catch((err) => {
			responses.error({
				status: 400,
				data: err,
				message: "Something bad getting all products",
				res
			});
			console.log(err);
		});
};

const getById = (req, res) => {
	const id = req.params.id;
	if (!req.userId) {
		throw new Error("User not authenticated");
	}
	const userId = req.userId;
	orderController
		.getOrdersById(id, userId)
		.then((data) => {
			if (data) {
				responses.success({
					status: 200,
					data,
					message: `Getting Product with id: ${id}`,
					res
				});
			} else {
				responses.error({
					status: 404,
					message: `product with ID: ${id}, not found`,
					res
				});
			}
		})
		.catch((err) => {
			responses.error({
				status: 400,
				data: err,
				message: "Something bad getting the product",
				res
			});
		});
};

const createOrder = (req, res) => {
	if (!req.userId) {
		throw new Error("User not authenticated");
	}
	const token = req.header("Authorization")?.split(" ")[1];

	if (!token) {
		throw new Error("Token requerido");
	}
	const userId = req.userId;
	const data = req.body;
	orderController
		.createOrders(data, userId, token)
		.then((data) => {
			if (data) {
				responses.success({
					status: 201,
					data,
					message: `Order created successfully`,
					res
				});
			} else {
				responses.error({
					status: 400,
					message: `Order creation failed`,
					res
				});
			}
		})
		.catch((err) => {
			responses.error({
				status: 400,
				data: err,
				message: "Something bad creating the order",
				res
			});
		});
};

module.exports = {
	getAll,
	getById,
	createOrder
};
