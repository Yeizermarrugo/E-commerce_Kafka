const uuid = require("uuid");
const { sendOrderCreateEvent } = require("../kafka/producer");
const { saveEvent } = require("../event.db/mongoClient");
const Orders = require("../models/order.model");
const axios = require("axios");

const getAllOrders = async (userId) => {
	const data = await Orders.findAll({ where: { user_id: userId } });
	return data;
};

const getOrdersById = async (id, userId) => {
	const data = await Orders.findOne({
		where: { id: id, user_id: userId }
	});
	return data;
};

const createOrders = async (data, userId, token) => {
	try {
		// Obtener ítems del carrito
		const cartResponse = await axios.get(`http://cart-service:3004/v1/cart`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		const cartItemsRaw = cartResponse.data.data;

		if (!cartItemsRaw || cartItemsRaw.length === 0) {
			throw new Error("El carrito está vacío");
		}

		// Obtener precio de cada producto y calcular subtotal
		const cartItems = await Promise.all(
			cartItemsRaw.map(async (item) => {
				const productRes = await axios.get(`http://product-service:3003/v1/products/${item.product_id}`, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});

				const product = productRes.data.data;
				return {
					product_id: item.product_id,
					quantity: item.quantity,
					price: product.precio,
					total: product.precio * item.quantity
				};
			})
		);

		// Crear la orden
		const newOrder = await Orders.create({
			id: uuid.v4(),
			user_id: userId,
			items: cartItems
		});

		// Enviar evento
		sendOrderCreateEvent(newOrder);

		// Guardar evento en MongoDB
		const eventToSave = {
			eventId: uuid.v4(),
			timestamp: new Date(),
			source: "order-service",
			topic: process.env.TOPIC,
			payload: newOrder.dataValues,
			snapshot: { status: "ORDER_CREATED" }
		};

		saveEvent(eventToSave);

		// Eliminar productos del carrito y actualizar stock
		await Promise.all(
			cartItemsRaw.map(async (item) => {
				// Eliminar producto del carrito
				await axios.delete(`http://cart-service:3004/v1/cart/${item.id}/order`, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});

				// Descontar el stock del producto
				await axios.put(
					`http://product-service:3003/v1/products/${item.product_id}/stock`,
					{
						quantity: item.quantity // Restar cantidad del stock
					},
					{
						headers: {
							Authorization: `Bearer ${token}`
						}
					}
				);
			})
		);

		return newOrder;
	} catch (error) {
		console.error("Error creando la orden:", error.message);
		throw error;
	}
};

module.exports = {
	getAllOrders,
	getOrdersById,
	createOrders
};
