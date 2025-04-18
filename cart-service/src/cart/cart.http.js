const ProductsCartItems = require("./cart.controller");
const responses = require("../utils/handleResponses");

const getAll = (req, res) => {
	if (!req.userId) {
		throw new Error("User not authenticated");
	}
	const userId = req.userId;
	ProductsCartItems.getAllProductsCartItems(userId)
		.then((data) => {
			responses.success({
				status: 200,
				data: data,
				message: "Getting all ProductsCartItems",
				res
			});
		})
		.catch((err) => {
			responses.error({
				status: 400,
				data: err,
				message: "Something bad getting all ProductsCartItems",
				res
			});
			console.log(err);
		});
};

const getById = (req, res) => {
	const id = req.params.id;
	ProductsCartItems.getproductsCartItemsById(id)
		.then((data) => {
			if (data) {
				responses.success({
					status: 200,
					data,
					message: `Getting ProductsCartItems with id: ${id}`,
					res
				});
			} else {
				responses.error({
					status: 404,
					message: `ProductsCartItems with ID: ${id}, not found`,
					res
				});
			}
		})
		.catch((err) => {
			responses.error({
				status: 400,
				data: err,
				message: "Something bad getting the ProductsCartItems",
				res
			});
		});
};

const add = (req, res) => {
	if (!req.userId) {
		throw new Error("User not authenticated");
	}
	const token = req.header("Authorization")?.split(" ")[1];

	if (!token) {
		throw new Error("Token requerido");
	}
	const userId = req.userId;
	const data = req.body;
	ProductsCartItems.addProductCartItems(data, userId, token)
		.then((data) => {
			responses.success({
				status: 201,
				data,
				message: `ProductsCartItems created successfully`,
				res
			});
		})
		.catch((err) => {
			console.log("error: ", err);
			responses.error({
				status: 400,
				data: err,
				message: "Something bad creating the ProductsCartItems",
				res
			});
		});
};

const remove = (req, res) => {
	const id = req.params.id;
	const userId = req.userId;
	if (!userId) {
		throw new Error("User not authenticated");
	}
	ProductsCartItems.deleteProductCartItems(id, userId)
		.then((data) => {
			if (data) {
				responses.success({
					status: 200,
					data,
					message: `ProductsCartItems with id: ${id} deleted successfully`,
					res
				});
			} else {
				responses.error({
					status: 404,
					data: err,
					message: `The ProductsCartItems with ID ${id} not found`,
					res
				});
			}
		})
		.catch((err) => {
			console.log("error: ", err);
			responses.error({
				status: 400,
				data: err,
				message: `Error ocurred trying to delete Product with id ${id}`,
				res
			});
		});
};

const update = (req, res) => {
	const id = req.params.id;
	const userId = req.userId;
	const { quantity } = req.body;
	if (!userId) {
		throw new Error("User not authenticated");
	}
	ProductsCartItems.updateProductCartItem(id, quantity, userId)
		.then((data) => {
			if (data) {
				responses.success({
					status: 200,
					data,
					message: `ProductsCartItems with id: ${id} updated successfully`,
					res
				});
			} else {
				responses.error({
					status: 404,
					data: err,
					message: `The ProductsCartItems with ID ${id} not found`,
					res
				});
			}
		})
		.catch((err) => {
			console.log("error: ", err);
			responses.error({
				status: 400,
				data: err,
				message: `Error ocurred trying to update Product with id ${id}`,
				res
			});
		});
};

const order = (req, res) => {
	const userId = req.userId;
	const id = req.params.id;

	ProductsCartItems.OrdeproductCartItems(id, userId)
		.then((data) => {
			if (data) {
				responses.success({
					status: 200,
					data,
					message: `ProductsCartItem with id: ${id} ordered and deleted successfully`,
					res
				});
			} else {
				responses.error({
					status: 404,
					data: null,
					message: `The ProductsCartItem with ID ${id} was not found`,
					res
				});
			}
		})
		.catch((err) => {
			console.error("error: ", err);
			responses.error({
				status: 400,
				data: err.message,
				message: `Error occurred trying to delete Product with id ${id}`,
				res
			});
		});
};

module.exports = {
	getAll,
	getById,
	add,
	remove,
	update,
	order
};
