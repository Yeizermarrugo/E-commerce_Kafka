const productController = require("./product.controller");
const responses = require("../utils/handleResponses");

const getAll = (req, res) => {
	productController
		.getAllProducts()
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
	productController
		.getproductsById(id)
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

const remove = (req, res) => {
	const id = req.params.id;

	productController
		.deleteProduct(id)
		.then((data) => {
			if (data) {
				responses.success({
					status: 200,
					data,
					message: `Product with id: ${id} deleted successfully`,
					res
				});
			} else {
				responses.error({
					status: 404,
					data: err,
					message: `The Product with ID ${id} not found`,
					res
				});
			}
		})
		.catch((err) => {
			responses.error({
				status: 400,
				data: err,
				message: `Error ocurred trying to delete Product with id ${id}`,
				res
			});
		});
};

module.exports = {
	getAll,
	getById,
	remove
};
