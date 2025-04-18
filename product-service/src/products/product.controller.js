const uuid = require("uuid");

const Products = require("../models/product.model");
const { sendProductCreateEvent } = require("../kafka/producer");
const { saveEvent } = require("../event.db/mongoClient");

const getAllProducts = async () => {
	const data = await Products.findAll();
	return data;
};

const getproductsById = async (id) => {
	const data = await Products.findOne({
		where: { id: id }
	});
	return data;
};

const createProduct = async (data) => {
	const newProduct = await Products.create({
		id: uuid.v4(),
		nombre: data.nombre,
		descripcion: data.descripcion,
		precio: data.precio,
		categoria: data.categoria,
		stock: data.stock
	});
	sendProductCreateEvent(newProduct);

	const eventToSave = {
		eventId: uuid.v4(),
		timestamp: new Date(),
		source: "product-service",
		topic: process.env.TOPIC,
		payload: newProduct.dataValues,
		snapshot: { status: "PRODUCT_CREATE" }
	};
	saveEvent(eventToSave);
	return newProduct;
};

const deleteProduct = async (id) => {
	const data = await Products.destroy({
		where: {
			id: id
		}
	});
	return data;
};


module.exports = {
	getAllProducts,
	getproductsById,
	createProduct,
	deleteProduct
};
