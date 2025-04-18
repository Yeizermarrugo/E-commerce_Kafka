const router = require("express").Router();

const ProductsCartItems = require("./cart.http");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/", verifyToken, ProductsCartItems.getAll);

// router.get("/:id", verifyToken, ProductsCartItems.getById);
router.post("/", verifyToken, ProductsCartItems.add);
router.delete("/:id", verifyToken, ProductsCartItems.remove);
router.patch("/:id", verifyToken, ProductsCartItems.update);
router.delete("/:id/order", verifyToken, ProductsCartItems.order);

module.exports = { router };
