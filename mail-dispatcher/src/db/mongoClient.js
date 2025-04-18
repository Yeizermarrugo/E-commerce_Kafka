const mongoose = require("mongoose");
require("dotenv").config();

// Esquema para eventos
const eventSchema = new mongoose.Schema({
	eventId: String,
	timestamp: Date,
	source: String,
	topic: String,
	payload: Object,
	snapshot: Object
});

const EventModel = mongoose.model("Event", eventSchema);

const connectMongo = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("MongoDB connected");
	} catch (error) {
		console.error("MongoDB connection error:", error);
	}
};

const saveEvent = async (eventData) => {
	try {
		const event = new EventModel(eventData);
		await event.save();
		console.log("Evento guardado en MongoDB");
	} catch (err) {
		console.error("Error guardando evento:", err);
	}
};

module.exports = {
	connectMongo,
	saveEvent
};
