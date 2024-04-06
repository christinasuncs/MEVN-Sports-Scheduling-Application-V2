const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://new_user:gdxwqcSfJ6G2m0DF@cluster0.1znnbzj.mongodb.net/sports_scheduling_application';

mongoose.connect(connectionString).then(() => console.log('Database connected')).catch((err) => console.log(err));