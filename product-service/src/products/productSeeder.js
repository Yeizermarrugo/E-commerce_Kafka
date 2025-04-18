const { faker } = require("@faker-js/faker");
const { createProduct } = require("./product.controller");
const Products = require("../models/product.model");

const seedProducts = async () => {
	try {
		const existingCount = await Products.count();

		console.log(`🔍 Productos existentes en la base de datos: ${existingCount}`);

		if (existingCount >= 20) {
			console.log("✅ Ya hay suficientes productos, no se crearán más.");
			return;
		}

		// Crear 50 productos con Faker
		for (let i = 0; i < 50; i++) {
			const fakeProduct = {
				nombre: faker.commerce.productName(),
				descripcion: faker.commerce.productDescription(),
				precio: parseFloat(faker.commerce.price(10, 1000)),
				categoria: faker.commerce.department(),
				stock: Math.floor(Math.random() * (100 - 10 + 1)) + 10
			};

			await createProduct(fakeProduct);
			console.log(`✅ Producto ${i + 1} creado: ${fakeProduct.nombre}`);
		}

		console.log("🎉 Se generaron 50 productos correctamente.");
	} catch (error) {
		console.error("❌ Error al generar productos:", error);
	}
};

module.exports = seedProducts;
