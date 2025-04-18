const jwt = require("jsonwebtoken");
const { loginUser } = require("./auth.controlle");
const responses = require("../utils/handleResponses");
const config = require("../../config").api;
const { createUser } = require("../users/user.controller");
const Users = require("../models/user.model");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const { hashPassword } = require("../utils/crypt");
const { sendUserRegistrationEvent, sendUserLogginEvent } = require("../kafka/producer");

const Event = mongoose.model("Event", new mongoose.Schema({}, { strict: false }));

// Función genérica para crear eventos
const CreateEvent = async (userData, eventType) => {
	const { nombre, apellido, email, telefono } = userData;
	const event = {
		eventId: uuidv4(),
		timestamp: new Date(),
		source: "UserService",
		topic: eventType === "REGISTER" ? process.env.TOPIC : process.env.TOPIC_LOGGEDIN,
		payload: { nombre, apellido, email, telefono },
		snapshot: {
			userId: uuidv4(),
			nombre,
			status: eventType === "REGISTER" ? "REGISTERED" : "LOGGED_IN"
		}
	};

	// Agregar el password si es un evento de registro
	if (eventType === "REGISTER") {
		event.payload.password = hashPassword(userData.password);
	}

	try {
		if (eventType === "REGISTER") {
			await sendUserRegistrationEvent(event);
		} else if (eventType === "LOGIN") {
			await sendUserLogginEvent(event); // Asegúrate de usar la función correcta
		}

		// Guardar el evento en MongoDB
		await Event.create(event);
		console.log(`[EVENT] ${eventType} sent and saved`);
	} catch (error) {
		console.error(`[ERROR] Failed to send ${eventType} event`, error);
	}
};

// Función para iniciar sesión
const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const data = await loginUser(email, password);

		if (!data) {
			return responses.error({
				res,
				status: 401,
				message: "Invalid Credentials"
			});
		}

		const token = jwt.sign({ id: data.id, email: data.email, password: data.password }, config.secretOrKey, { expiresIn: "1d" });

		// Llamar a CreateEvent con el tipo "LOGIN"
		await CreateEvent(data, "LOGIN");

		responses.success({
			res,
			status: 200,
			message: "Correct Credentials!",
			data: token
		});
	} catch (err) {
		responses.error({
			res,
			status: 400,
			data: err,
			message: "Something Bad"
		});
	}
};

// Función para registro de usuario
const signUp = async (req, res) => {
	const data = req.body;
	const user = await Users.findOne({ where: { email: data.email } });

	if (user) {
		return res.json({ success: false, message: "Usuario ya existe" });
	}

	try {
		const newUser = await createUser(data);

		// Llamar a CreateEvent con el tipo "REGISTER"
		await CreateEvent(newUser, "REGISTER");

		responses.success({
			status: 201,
			data: newUser,
			message: `User created successfully with id: ${newUser.id}`,
			res
		});
	} catch (err) {
		responses.error({
			status: 400,
			data: err,
			message: "Error occurred trying to create a new user",
			res
		});
	}
};

module.exports = {
	login,
	signUp
};
