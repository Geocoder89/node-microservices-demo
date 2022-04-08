const express = require('express')

const app = express()
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const amqp = require('amqplib')
const orderModel = require('./models/Order')
// const isAuthenticated = require('../isAuthenticated')


var channel,connection

dotenv.config({
    path: 'config/config.env'
})
const PORT = process.env.PORT_THREE || 9090



connectDB()


app.use(express.json())
function createOrder(products,userEmail) {
    let total = 0;
    for(let t=0; t < products.length; ++t) {
        total += products[t].price
    }

    const newOrder = new orderModel({
        products,
        user: userEmail,
        total_price: total
    })

    console.log('this is the new order',newOrder)

    newOrder.save()

    return newOrder

}

async function connectAmqp() {

    const amqpServer = 'amqp://localhost:5672'
    connection = await amqp.connect(amqpServer)
    channel = await connection.createChannel()
    await channel.assertQueue("ORDER")
}



connectAmqp().then(()=>{
    channel.consume("ORDER",(data)=>{
        console.log('Consuming Order queue')
        const {products,userEmail} = JSON.parse(data.content)
        const newOrder = createOrder(products,userEmail);

        channel.ack(data);
     
        channel.sendToQueue("PRODUCT",Buffer.from(JSON.stringify({newOrder}))
        
        )
    })
})








app.listen(PORT,()=>{
    console.log(`Order service at ${PORT}`)
})