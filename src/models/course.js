const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    branch: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Course', courseSchema)