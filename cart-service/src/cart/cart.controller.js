const uuid = require("uuid");
const { sendProductCartItemCreateEvent } = require("../kafka/producer");
const { saveEvent } = require("../event.db/mongoClient");
const CartItem = require("../models/cart.model");
const axios = require("axios");

const getAllProductsCartItems = async (userId) => {
	const data = await CartItem.findAll({ where: { user_id: userId } });
	return data;
};

const getproductsCartItemsById = async (id, userId) => {
	const data = await CartItem.findOne({
		where: { id: id, user_id: userId }
	});
	return data;
};

const addProductCartItems = async (data, userId, token) => {
	try {
		const response = await axios.get(`http://product-service:3003/v1/products/${data.product_id}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		const product = response.data.data;
		console.log("response: ", response);
		console.log("product: ", product);
		console.log("userId: ", userId);

		const existingItem = await CartItem.findOne({
			where: { user_id: userId, product_id: data.product_id }
		});

		let updatedItem;

		if (existingItem) {
			const newQuantity = existingItem.quantity + data.quantity;

			if (newQuantity < 0) {
				throw new Error("La cantidad no puede ser menor que 0.");
			}

			updatedItem = await CartItem.update(
				{ quantity: newQuantity },
				{
					where: { id: existingItem.id }
				}
			);
			updatedItem = await CartItem.findByPk(existingItem.id);
		} else {
			if (product.stock < data.quantity) {
				throw new Error("No hay suficiente stock para este producto.");
			}
			const id = uuid.v4();
			updatedItem = await CartItem.create({
				id,
				user_id: userId,
				product_id: data.product_id,
				quantity: data.quantity
			});
		}

		const eventToSave = {
			eventId: uuid.v4(),
			timestamp: new Date(),
			source: "cart-service",
			topic: process.env.TOPIC,
			payload: updatedItem.dataValues,
			snapshot: { cartId: updatedItem.id, totalItems: updatedItem.quantity, updatedAt: new Date(), status: "PRODUCTCARTITEM_CREATE" }
		};
		sendProductCartItemCreateEvent(eventToSave);
		saveEvent(eventToSave);
		return updatedItem;
	} catch (error) {
		console.error("Error al agregar producto al carrito:", error);
		throw new Error("Error al agregar producto al carrito: " + (error.response?.data?.message || error.message));
	}
};

const updateProductCartItem = async (id, quantity, userId) => {
	const item = await getproductsCartItemsById(id, userId);

	if (!item) {
		throw new Error("Producto no encontrado en el carrito.");
	}

	const newQuantity = quantity === 0 ? 0 : item.quantity + quantity;

	if (newQuantity <= 0) {
		await deleteProductCartItems(id, userId);
		return { message: "Producto eliminado del carrito.", deleted: true };
	}

	await CartItem.update({ quantity: newQuantity }, { where: { id } });

	const updatedItem = await CartItem.findByPk(id);

	const eventToSave = {
		eventId: uuid.v4(),
		timestamp: new Date(),
		source: "cart-service",
		topic: process.env.TOPIC_UPDATE,
		payload: { ...updatedItem.dataValues, oldQuantity: item.quantity, quantitySummary: quantity },
		snapshot: {
			cartId: updatedItem.id,
			totalItems: updatedItem.quantity,
			updatedAt: new Date(),
			status: "CART_QUANTITY_UPDATED"
		}
	};

	sendProductCartItemCreateEvent(eventToSave);
	saveEvent(eventToSave);

	return updatedItem;
};

const deleteProductCartItems = async (id, userId) => {
	const product = await getproductsCartItemsById(id, userId);
	if (!product) {
		throw new Error("product not found");
	}
	const data = await CartItem.destroy({
		where: { id }
	});
	console.log("data: ", data);
	const eventToSave = {
		eventId: uuid.v4(),
		timestamp: new Date(),
		source: "cart-service",
		topic: process.env.TOPIC_REMOVALS,
		payload: { user_id: userId, product_id: product.product_id },
		snapshot: { user_id: userId, product_id: product.product_id, quantity: product.quantity }
	};
	sendProductCartItemCreateEvent(eventToSave);
	await saveEvent(eventToSave);

	return data;
};

const OrdeproductCartItems = async (id, userId) => {
	const product = await getproductsCartItemsById(id, userId);
	if (!product) {
		throw new Error("product not found");
	}
	const deleted = await CartItem.destroy({
		where: { id }
	});
	return deleted;
};

module.exports = {
	getAllProductsCartItems,
	getproductsCartItemsById,
	addProductCartItems,
	deleteProductCartItems,
	updateProductCartItem,
	OrdeproductCartItems
};
