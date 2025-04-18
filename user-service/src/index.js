const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const resHandler = require("./utils/handleResponses");
const initModels = require("./models/initModels");
const config = require("../config").api;
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
//*archivos de rutas
const userRoute = require("./users/user.routes").router;
const authRoute = require("./auth/auth.routes").router;
const swaggerDoc = require("./swagger.json");

//* Conexion BD
const db = require("./utils/database");
const connectMongo = require("./event.db/mongoClient");

//*configuracion inicial
const app = express();
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors());

initModels();
db.authenticate()
	.then(() => console.log("Database Authenticated"))
	.catch((err) => console.log(err));

db.sync()
	.then(() => console.log("Database synced"))
	.catch((err) => console.log(err));

connectMongo();

app.get("/", (req, res) => {
	resHandler.success({
		res,
		status: 200,
		message: "Servidor inicializado correctamente",
		data: null
	});
});

app.use("/v1/users", userRoute);
app.use("/v1/auth", authRoute);
app.use("/v1/doc", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
// app.use("*", (req, res) => {
// 	resHandler.error({
// 		res,
// 		status: 404,
// 		message: `URL not found, please try with ${config.host}`
// 	});
// });

app.listen(config.port, () => {
	console.log(`Server started at port ${config.port}`);
});

module.exports = app;
