const mongoose = require('mongoose')


const orderSchema = new mongoose.Schema({
    products: [
       { product_id: String},

       
    ],
    user: String,
    total_price: Number

},{
    timestamps: true
})

const orderModel = mongoose.model('order',orderSchema)

module.exports = orderModel