const { Kafka } = require("kafkajs");

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] });
const producer = kafka.producer();

// Función para enviar evento de registro
const sendProductCartItemCreateEvent = async (event) => {
	console.log("event create", event);
	if (event) await producer.connect();
	await producer.send({
		topic: event.topic === "cart-update" ? process.env.TOPIC : process.env.TOPIC_REMOVALS,
		messages: [{ value: JSON.stringify(event) }]
	});
	await producer.disconnect();
};

module.exports = {
	sendProductCartItemCreateEvent
};
