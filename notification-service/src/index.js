const runConsumer = require("./kafka/consumer");
const express = require("express");
const { connectMongo } = require("./db/mongoClient");

const app = express();
app.use(express.json());

connectMongo();
runConsumer().catch(console.error);

const PORT = process.env.port || 3002;
app.listen(PORT, () => {
	console.log(`Notification Service listening on port ${PORT}`);
});
