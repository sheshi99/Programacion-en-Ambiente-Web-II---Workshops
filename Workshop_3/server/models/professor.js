const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
    firstname: {
        required: true,
        type: String
    },
    lastname: {
        required: true,
        type: String
    },
    idNumber:{
        required: true,
        type: String
    },
    age: {
        required: true,
        type: Number
    }
    
})

module.exports = mongoose.model('Professor', courseSchema)