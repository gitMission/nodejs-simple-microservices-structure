const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    age: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
});

module.exports = mongoose.model('Customer', customerSchema);