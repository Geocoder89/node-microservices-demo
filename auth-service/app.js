const express = require('express')

const app = express()
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const userModel = require('./models/User')
const jwt = require('jsonwebtoken')


dotenv.config({
    path: 'config/config.env'
})
const PORT = process.env.PORT_ONE || 7070

connectDB()

app.use(express.json())
// Register

app.post('/auth/register',async(req,res)=>{
    const {email,password,name} = req.body
    const userExist = await userModel.findOne({email})

    if(userExist) {
        return res.json({message: 'user already exists'})
    }

    const user = await userModel.create({
        email,
        password,
        name
    }
        )

    return res.status(201).json({
        message: 'User created successfully',
        success: true,
        data: user
    })
})


// login

app.post('/auth/login',async(req,res)=>{
    const {email,password} = req.body;

    const user = await userModel.findOne({email})

    if(!user) {
        return res.status(404).json({message:'User does not exist'})
    }

    // check if password exists 

    if(password !== user.password) {
        return res.json({message:"password is incorrect"})
    }

    const payload = {
        email,
        name: user.name
    }

    jwt.sign(payload,process.env.JWT_SECRET,(err,token)=>{
        if(err) {
            console.log(error)
        }

        return res.status(200).json({
            token
        })
    })

})



app.listen(PORT,()=>{
    console.log(`Auth service at ${PORT}`)
})