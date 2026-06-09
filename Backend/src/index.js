const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const routes = require('./routes/index.js');
const cors = require('cors');
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

app.use(cors())


routes(app);

connectDB();

app.listen(port, () => {
    console.log('Server is running on port:', port);
});