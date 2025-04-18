const { Kafka } = require("kafkajs");
const { saveEvent } = require("../db/mongoClient");
const { v4: uuidv4 } = require("uuid");
const { getUserById } = require("./getUserById");
const { getProductById } = require("./getProductById");

const kafka = new Kafka({
	clientId: "mail-dispatcher",
	brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: "mail-dispatcher-group" });
const producer = kafka.producer();

const runConsumer = async () => {
	await consumer.connect();
	await producer.connect();

	// Suscribirse a ambos tópicos
	await consumer.subscribe({ topic: "user-registration", fromBeginning: true });
	await consumer.subscribe({ topic: "user-loggedin", fromBeginning: true });
	await consumer.subscribe({ topic: "cart-removals", fromBeginning: true });
	await consumer.subscribe({ topic: "order-created", fromBeginning: true });

	await consumer.run({
		eachMessage: async ({ topic, message }) => {
			const data = JSON.parse(message.value.toString());
			// console.log(`📩 Mensaje recibido en tópico [${topic}]:`, data?.;
			console.log("data antes?. ", data);
			let emailPayload;
			let flowTopic;
			try {
				if (topic === "user-registration") {
					emailPayload = {
						email: data?.payload.email,
						nombre: data?.payload.nombre,
						message: "Bienvenido a nuestra plataforma XD"
						// content: `Hola ${data?.payload.nombre}, gracias por registrarte en nuestro e-commerce.`
					};
					flowTopic = "welcome-flow";
				} else if (topic === "user-loggedin" && data?.payload?.email !== "mail-dispatcher@service.com") {
					emailPayload = {
						email: data?.payload.email,
						nombre: data?.payload.nombre,
						message: "Inicio de sesión exitoso"
						// content: `Hola ${data?.payload.nombre}, tu sesión se ha iniciado correctamente.`
					};
					flowTopic = "login-notifications";
				} else if (topic === "cart-removals" && !data?.payload.quantitySummary && topic !== "order-created") {
					const user = await getUserById(data?.payload.user_id);
					const product = await getProductById(data?.payload.product_id ? data?.payload.product_id : data?.snapshot.product_id);
					emailPayload = {
						email: user?.email,
						nombre: user?.nombre,
						apellido: user?.apellido,
						userId: data?.payload.user_id,
						productId: data?.payload.product_id,
						quantityRemoved: data?.payload?.quantitySummary,
						message: `Se eliminó ${data?.payload.quantitySummary === 0 ? product?.nombre : product?.nombre} del carrito.`,
						product
					};
					flowTopic = "cart-removal-notifications";
					console.log("emailPayload", emailPayload);
				} else if (topic === "order-created") {
					const user = await getUserById(data?.user_id);
					const totalOrden = data.items.reduce((acc, item) => acc + item.total, 0);
					console.log("Total de la orden:", user);
					emailPayload = {
						email: user?.email,
						nombre: user?.nombre,
						apellido: user?.apellido,
						content: `Total: $${totalOrden}`
					};

					flowTopic = "invoice-processing";
					console.log("data: ", data);
				} else {
					console.warn("🟡 Tópico no manejado:", topic);
					return;
				}
			} catch (e) {
				console.error(e);
			}

			// Publicar mensaje al siguiente tópico
			await producer.send({
				topic: flowTopic,
				messages: [
					{
						value: JSON.stringify({
							...emailPayload,
							source: "mail-dispatcher"
						})
					}
				]
			});

			// Guardar evento en MongoDB
			await saveEvent({
				eventId: uuidv4(),
				timestamp: new Date(),
				source: "mail-dispatcher",
				topic: flowTopic,
				payload: emailPayload,
				snapshot: { status: "EMAIL_QUEUED" }
			});
		}
	});
};

module.exports = runConsumer;
