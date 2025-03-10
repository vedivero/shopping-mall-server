const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoURI = process.env.MONGO_DB_ADDRESS;
mongoose
   .connect(mongoURI, { useNewUrlParser: true })
   .then(() => console.log('Mongoose Connected'))
   .catch((err) => console.log('DB Connection Failed'));

app.listen(process.env.PORT || 5000, () => {
   console.log('Server On');
});
