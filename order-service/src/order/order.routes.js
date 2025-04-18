const router = require("express").Router();

const orderService = require("./order.http");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/", verifyToken, orderService.getAll);

router.get("/:id", verifyToken, orderService.getById);
router.post("/", verifyToken, orderService.createOrder);

module.exports = { router };
