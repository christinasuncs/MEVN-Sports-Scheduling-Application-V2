require('dotenv').config()
const mongoose = require('mongoose');

const connectionString = process.env.MONGO_URL;

mongoose.connect(connectionString).then(() => console.log('Database connected')).catch((err) => console.log(err));