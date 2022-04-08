const jwt = require('jsonwebtoken')


const isAuthenticated =(req,res,next)=> {
    const token = req.headers["authorization"].split(" ")[1]

    jwt.verify(token,'Cest la vie',(err,user)=>{
        if(err) {
            return res.json({message: err})
        }

        req.user = user

        next()
    })
}

module.exports = isAuthenticated