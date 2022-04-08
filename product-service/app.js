const express = require('express')

const app = express()
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const amqp = require('amqplib')
const jwt = require('jsonwebtoken')
const isAuthenticated = require('../isAuthenticated')
const productModel = require('./models/Product')

var order;
var channel,connection

dotenv.config({
    path: 'config/config.env'
})
const PORT = process.env.PORT_TWO || 8080

app.use(express.json())

connectDB()


async function connectAmqp() {

    const amqpServer = 'amqp://localhost:5672'
    connection = await amqp.connect(amqpServer)
    channel = await connection.createChannel()
    await channel.assertQueue("PRODUCT")
}

connectAmqp()


// routes

// create a product 
app.post('/product/create',isAuthenticated,async(req,res)=>{

    const {name,description,price} = req.body

    const user = req.user
    console.log(req.user)

    const product = await productModel.create({name,description,price})

    return res.status(201).json({
        message: 'Product successfully created',
        success: true,
        data: {product,user}
    })

})

// buy a product

// user sends a list of product ids to buy
// creating an order with those products and a total value of sum of product prices

app.post("/product/buy", isAuthenticated, async (req, res) => {
    const { ids } = req.body;
    const products = await productModel.find({ _id: { $in: ids } });
    channel.sendToQueue(
        "ORDER",
        Buffer.from(
            JSON.stringify({
                products,
                userEmail: req.user.email,
            })
        )
    );
    channel.consume("PRODUCT", (data) => {
        order = JSON.parse(data.content);
        console.log(order)
    });
    
    return res.json(order);
});
app.listen(PORT,()=>{
    console.log(`Product service at ${PORT}`)
})