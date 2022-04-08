const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
},{
    timestamps: true
})

const userModel = mongoose.model('User',userSchema)

module.exports = userModel