const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const resHandler = require("./utils/handleResponses");
const initModels = require("./models/initModels");
const config = require("../config").api;
const cors = require("cors");
//*archivos de rutas
const orderRoute = require("./order/order.routes").router;

//* Conexion BD
const db = require("./utils/database");
const { connectMongo } = require("./event.db/mongoClient");

//*configuracion inicial
const app = express();
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors());

db.authenticate()
	.then(() => console.log("Database Authenticated"))
	.catch((err) => console.log(err));

db.sync()
	.then(() => console.log("Database synced"))
	.catch((err) => console.log(err));

initModels();
connectMongo();

app.get("/", (req, res) => {
	resHandler.success({
		res,
		status: 200,
		message: "Servidor inicializado correctamente",
		data: null
	});
});

app.use("/v1/order", orderRoute);

app.listen(config.port, () => {
	console.log(`Server started at port ${config.port}`);
});

module.exports = app;
