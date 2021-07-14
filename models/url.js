const mongoose = require('mongoose');

// setup the schema
const urlSchema = mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    shorturl: {
        type: String,
        required: true
    }
})

const Url = mongoose.model('url', urlSchema)
module.exports = Url;