const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.id; // Guardamos solo el id
		next();
	} catch (error) {
		return res.status(401).json({ message: "Invalid token" });
	}
};

module.exports = { verifyToken };
