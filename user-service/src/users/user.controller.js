const uuid = require("uuid");
const { hashPassword } = require("../utils/crypt");

const Users = require("../models/user.model");

const getAllUsers = async () => {
	const data = await Users.findAll({
		attributes: {
			exclude: ["password", "createdAt", "updatedAt"]
		}
	});
	return data;
	//? Select * from users;
};

const getUserById = async (id) => {
	const data = await Users.findOne({
		where: { id: id },
		attributes: { exclude: ["password"] }
	});
	return data;
	//? select * from users where id = ${id};
};

const createUser = async (data) => {
	const newUser = await Users.create({
		id: uuid.v4(),
		nombre: data.nombre,
		apellido: data.apellido,
		email: data.email,
		password: hashPassword(data.password),
		telefono: data.telefono
	});
	return newUser;
};

const deleteUser = async (id) => {
	const data = await Users.destroy({
		where: {
			id: id
		}
	});
	return data;
};

const getUserByEmail = async (email) => {
	const data = await Users.findOne({
		where: {
			email: email
		}
	});
	return data;
	//? select * from users where email = ${email};
};

module.exports = {
	getAllUsers,
	getUserById,
	getUserByEmail,
	createUser,
	deleteUser
};
