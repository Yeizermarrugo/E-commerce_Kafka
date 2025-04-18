const express = require("express");
const runConsumer = require("./kafka/consumer");
const { connectMongo } = require("./db/mongoClient");

const app = express();
app.use(express.json());

// Conexión a MongoDB
connectMongo();

// Arranque del consumidor Kafka
runConsumer().catch(console.error);

// Opcional: puedes levantar un puerto si quieres monitorear el servicio
const PORT = process.env.port || 3001;
app.listen(PORT, () => {
	console.log(`Mail Dispatcher Service listening on port ${PORT}`);
});
