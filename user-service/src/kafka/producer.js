const { Kafka } = require("kafkajs");

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] });
const producer = kafka.producer();

// Función para enviar evento de registro
const sendUserRegistrationEvent = async (event) => {
	await producer.connect();
	await producer.send({
		topic: process.env.TOPIC,
		messages: [{ value: JSON.stringify(event) }]
	});
	await producer.disconnect();
};

// Función para enviar evento de login
const sendUserLogginEvent = async (event) => {
	await producer.connect();
	await producer.send({
		topic: process.env.TOPIC_LOGGEDIN,
		messages: [{ value: JSON.stringify(event) }]
	});
	await producer.disconnect();
};

module.exports = { sendUserRegistrationEvent, sendUserLogginEvent };
