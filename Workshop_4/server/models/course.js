const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    code:{
        required: true,
        type: String
    },
    description:{
        required: true,
        type: String
    },
    professorId:{
        required: true,
        // Defines a reference to the Professor collection using MongoDB ObjectId.
        type: mongoose.Schema.Types.ObjectId,
        ref:'Professor'
    }
})

module.exports = mongoose.model('Course', courseSchema)