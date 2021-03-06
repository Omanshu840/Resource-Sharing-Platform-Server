const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    course: {
        type: ObjectId,
        ref: "Course"
    }
});

module.exports= mongoose.model('Resource', resourceSchema)