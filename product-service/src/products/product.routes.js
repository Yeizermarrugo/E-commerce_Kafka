const router = require("express").Router();

const productService = require("./product.http");
const { verifyToken } = require("../middleware/auth.middleware");
const Products = require("../models/product.model");

//* /api/v1/perfectskin/products/
router.get("/", verifyToken, productService.getAll);

//? /api/v1/products/me

router.get("/:id", verifyToken, productService.getById);
router.delete("/:id", verifyToken, productService.remove);

// En el servicio de productos (product-service)
router.put("/:id/stock", async (req, res) => {
	const { id } = req.params;
	const { quantity } = req.body;

	try {
		// Encontrar el producto por ID
		const product = await Products.findByPk(id);
		if (!product) {
			return res.status(404).json({ error: "Producto no encontrado" });
		}

		// Restar la cantidad del stock
		product.stock -= quantity;
		if (product.stock < 0) {
			product.stock = 0; // No permitir valores negativos de stock
		}
		await product.save();

		res.status(200).json({ message: "Stock actualizado", product });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error al actualizar el stock" });
	}
});

module.exports = { router };
