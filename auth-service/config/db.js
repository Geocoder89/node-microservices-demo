const mongoose = require('mongoose')


const connectDB= async()=> {

    const connection = await mongoose.connect(process.env.MONGODB_URI)

    console.log(` Auth service Database connected on ${connection.connection.host}`)
}





module.exports = connectDB