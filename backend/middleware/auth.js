
const jwt = require("jsonwebtoken")
const User = require("../models/User")

exports.isAutheticated = async (req,res,next) => {
    try {
        const {token} = req.cookies//assign cookie in token
        if(!token){//toeken is empty that mean user is'nt login
            return res.status(401).json({//send error msg
                message:"Please Login First"
            })
        }
    
        const decode = jwt.verify(token, process.env.JWT_SECRET) //decode token and verify using secret
//decode token and verify using secret
        req.user = await User.findById(decode._id)//assing token id that mean user id. we assign that genarate token method
    
    
        next()//go to next work post/delete etc.....
    } catch (error) {//send error
        res.status(500).json({
            message:error.message
        })
    }
   
  
}