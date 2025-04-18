const { Kafka } = require("kafkajs");
const { sendEmail } = require("../services/mail.services");
const { saveEvent } = require("../db/mongoClient");
const { v4: uuidv4 } = require("uuid");

const kafka = new Kafka({ clientId: "notification-service", brokers: [process.env.KAFKA_BROKER] });
const consumer = kafka.consumer({ groupId: "notification-service-group" });
const producer = kafka.producer();

const runConsumer = async () => {
	await consumer.connect();
	await producer.connect();
	await consumer.subscribe({ topic: "welcome-flow", fromBeginning: false });
	await consumer.subscribe({ topic: "login-notifications", fromBeginning: false });
	await consumer.subscribe({ topic: "cart-removal-notifications", fromBeginning: false });
	await consumer.subscribe({ topic: "invoice-processing", fromBeginning: false });

	await consumer.run({
		eachMessage: async ({ topic, message }) => {
			const data = JSON.parse(message.value.toString());
			console.log("data: ", data);

			let emailPayload;
			let flowTopic;

			try {
				if (topic === "welcome-flow") {
					emailPayload = {
						to: data.email,
						subject: "¡Bienvenido a nuestra plataforma!",
						content: `Hola ${data.nombre}, gracias por registrarte en nuestro e-commerce.`
					};
					flowTopic = "notification-register-topic";
				} else if (topic === "login-notifications") {
					emailPayload = {
						to: data.email,
						subject: "Inicio de sesión exitoso",
						content: `Hola ${data.nombre}, tu sesión se ha iniciado correctamente.`
					};
					flowTopic = "notification-login-topic";
				} else if (topic === "cart-removal-notifications") {
					emailPayload = {
						to: data.email,
						subject: "¿Olvidaste algo en tu carrito?",
						content: `Hola ${data.nombre}, Vimos que eliminaste ${data?.product?.nombre}`
					};
					flowTopic = "notification-cartItem-removal-topic";
				} else if (topic === "invoice-processing") {
					emailPayload = {
						to: data.email,
						subject: "¡Tu factura ha sido procesada!",
						content: `Hola ${data.nombre}, tu factura ha sido procesada correctamente por ${data.content}`
					};
					console.log("emailPayload: ", emailPayload);
				} else {
					console.warn("🟡 Tópico no manejado:", topic);
					return;
				}
			} catch (e) {
				console.error("❌ Error procesando mensaje:", e);
				return;
			}

			await sendEmail(emailPayload);

			const messageToSend = {
				...emailPayload,
				source: "notification-service"
			};

			await producer.send({
				topic: flowTopic,
				messages: [{ value: JSON.stringify(messageToSend) }]
			});

			const eventToSave = {
				eventId: uuidv4(),
				timestamp: new Date(),
				source: "notification-service",
				topic: flowTopic,
				payload: emailPayload,
				snapshot: { status: "EMAIL_SENT" }
			};

			await saveEvent(eventToSave);
		}
	});
};

module.exports = runConsumer;
