require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandling');
const limiter = require('./middlewares/requestLimiter');
const routes = require("./routes/indexRoutes");

const PORT = process.env.PORT || config.get('serverPort');

const app = express();
app.use(cors());
app.use(express.json());
app.use(limiter);
app.use('/api', routes);


app.use(errorHandler);

const start = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();
		app.listen(PORT, () => {
			console.log(`Server is running on ${PORT} port`);
		})
	} catch (error) {
		console.log(error);
	}
}
start();