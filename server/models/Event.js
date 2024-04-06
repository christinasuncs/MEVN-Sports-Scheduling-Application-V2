const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: Date,
    time: String, // HH:MM
    type: String,
    campus: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Campus'
    },
    teams: [{
        type: Schema.Types.ObjectId,
        ref: "Team"
    }],
    sport: String
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;