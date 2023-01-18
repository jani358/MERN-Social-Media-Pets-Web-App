const Post = require("../models/Post.js");
const User = require("../models/User.js");
const { sendEmail } = require("../middleware/sendEmail");
const crypto = require("crypto");


exports.register = async (req,res) => {
       
    try {

        const {name,email,password, avatar } = req.body//asign value [req body values]
        let user = await User.findOne({email});//find user entered email already exist or not
        
        if(user) {//find email then send err msg            
            return res
            .status(400)
            .json({success:false, message:"user already exists"})        
        }

        user = await User.create({//if user email does not exist then create new user         
            name,
            email,
            password,
            avatar:{public_id:"sample_id", url:"sampleurl"},       
        })
       
        res.status(201)//send success respond
        .json({
            success:true,
            user
        })

       } catch (error) {
        
        res.status(500).json({           
            success:false,
            message:error.message
        })
       }
}

exports.login = async(req,res)=>{
    
    try {
       
        const {email ,password} = req.body
        const user = await User.findOne({email}).select("+password")//Specifies which document fields to include or exclude (also known as the query "projection")
       
        if(!user){ //if email does not match then send err ,msg
            return res.status(400).json({
                success:false,
                message:"User does not exist"
            })  
        }
        
        const isMatch = await user.matchPassword(password)//check user enter password and relavant email password match or not[this method->User model ]
        
        if(!isMatch){ //is not match send error       
            return res.status(400).json({
                success:false,
                message:"Password is incorrect"
            }) 
        }
       
        const token = await user.genarateToken();//password is match then create token for relavant user[this method -> User model]
        const option = {
            expires:new Date(Date.now()+24*60*60*1000),//set token expire time [after 1 day expired mili seconds]
            httpOnly:true//HttpOnly flag when generating a cookie helps mitigate the risk of client side script accessing the protected cookie (if the browser supports it).
        }
        res.status(200).cookie("token",token,option)
        .json({
            success:true,
            user,
            token,
        })

    } catch (error) {
        res.status(500).json({   
            success:true,
            message:error.message
        })

    }
}

exports.followUser = async (req,res)=>{
    try {
        const userToFollow = await User.findById(req.params.id)//get the curret user want to follow user's id
        const loggedInUser = await User.findById(req.user._id)//get the current user's id

        if(!userToFollow){//check the user exists or not
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        if(loggedInUser.following.includes(userToFollow._id)){//check the current user following array if there is exits followed user
            //already exists current user following array followed user
            const indexFollowing = loggedInUser.following.indexOf(userToFollow._id)//current user following array check index of followed user 
            const indexFollowers = userToFollow.followers.indexOf(loggedInUser._id)//followed user followes array get the index of current user

            loggedInUser.following.splice(indexFollowing,1)//remove the followed user id current user following array 
            userToFollow.followers.splice(indexFollowers,1)//remove the current user id followed user followers array

            await loggedInUser.save();//save the data after update
            await userToFollow.save();//save the data after update

            return res.status(200).json({
                success:true,        
                message:"User Unfollowed"  
            })
        }else{
            loggedInUser.following.push(userToFollow._id)//userTofollow id add to current user following array
            userToFollow.followers.push(loggedInUser._id)//add the current user in userToFollow's follower array
    
            await loggedInUser.save();//save the data after update
            await userToFollow.save();//save the data after update
    
            return res.status(200).json({
                success:true,        
                message:"User followed"  
            })
        }
       
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.getPostFollowing = async (req,res)=>{
    try {
        //const user = await User.findById(req.user._id).populate("following","posts");//get the current user id and check his following[] array get the followed peaple post[populate the relavan data]
        const user = await User.findById(req.user._id)
        const posts = await Post.find({
            owner:{
                $in:user.following//The $in operator selects the documents where the value of a field equals any value in the specified array
            }
        }).populate("owner likes comments.user")  
        res.status(200).json({
            success:true,
            posts:posts.reverse()
            //following:user.following//send the respond [followed peaple id ad post id]
        })
    } catch (error) {
            res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.logout = (req,res)=>{
    try {
        res
        .status(200)
        .cookie("token",null,{expires:new Date(Date.now()),httpOnly:true})//token remove
        .json({
            success:true,
            message:"Logged out"
        })
    } catch (error) {
            res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.updatePassword = async (req,res)=>{
    
    try {
    const user = await User.findById(req.user._id).select("+password")//find the user and relavant password

    const {oldPassword,newPassword} = req.body//assign the values to variable using user send reqvest body
    
    if(!oldPassword || !newPassword){//if the user not enter values then send a error
        return res.status(400).json({
            success:false,
            message:"Please provide old and new password both"
        })
    }

    const isMatch = await user.matchPassword(oldPassword)//match his own password and user entered password if they are match or not
    if(!isMatch){//if they dont match send error
        return res.status(400).json({
           success:false,
           message:"Incorrect Old Password"
        })
    }
    user.password = newPassword//if they match assign new pasword
    await user.save()

    res.status(200).json({//send the success msg
        success:false,
        message:"Password Updated"
     })
     } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
     }
}

exports.updateProfile = async (req,res) =>{
    try {
        const user = await User.findById(req.user._id)//find the user using his id
        const {name,email} = req.body

        if(name){//get the name if he entered
            user.name = name
        }
        if(email){//get the mail if he entered
            user.email = email
        }

        await user.save()

        res.status(200).json({
            success:true,
            message:"profile updated"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.deleteMyProfile = async (req,res)=>{
    
    try {
        const user = await User.findById(req.user._id)
        const posts = user.posts
        const followers = user.followers
        const followings = user.following
        const userId = user._id
        await user.remove()//remove the document from db
        res
        .cookie("token",null,{
            expires:new Date(Date.now()),
            httpOnly:true
        })//logout the user after delete the profile

        //remove the all posts belong to user
        for(let i=0;i<posts.length;i++){
          const post = await Post.findById(posts[i])//find the each post id and assign post variable
          await post.remove()
        }
        //remove user from followers following
        for(let i=0;i<followers.length;i++){
            const follower = await User.findById(followers[i])//get the id of users of current user followers array 
            const index = follower.following.indexOf(userId)//above user following array get the index current user
            follower.following.splice(index,1)//remove the current user above array
            await follower.save()
        }

        //remove user from following's followers
        for(let i=0;i<followings.length;i++){
            const follows = await User.findById(followings[i])//get the id of users of current user following array 
            const index = follows.followers.indexOf(userId)//above user followers array get the index current user
            follows.followers.splice(index,1)//remove the current user above array
            await follows.save()
        }
        res.status(200).json({
            success:true,
            message:"Profile deleted"
        })

        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.myProfile = async (req,res)=>{
   try {
    const user = await User.findById(req.user._id).populate("posts")

    res.status(200).json({
        success:true,
        user
    })

   } catch (error) {
    res.status(500).json({
        success:false,
        message:error.message
    })
   }
}

exports.getUserProfile = async (req,res)=>{
    try {
        const user = await User.findById(req.params.id).populate("posts")
       
        if(!user){
           return res.status(404).json({
                success:false,
                message:"User Not Found"
            })
        }
        res.status(200).json({
            success:true,
            user
        })
    
       } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
       }
}

exports.getAllUsers = async (req,res)=>{
    try {
        const users = await User.find({})//Creates a find query: gets a list of documents that match filter.
       
       
        res.status(200).json({
            success:true,
            users
        })
    
       } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
       }
}


exports.forgotPassword = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });//find user enter email is in databse and email is exists not and then get relavant user data
  
      if (!user) {//if user data not found send error respond
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      const resetPasswordToken = user.getResetPasswordToken();//genarate reset password token
  
      await user.save();//after genarate token update db and save
  
      const resetUrl = `${req.protocol}://${req.get(//The req. protocol property contains the request protocol string which is either HTTP or (for TLS requests) https
        "host"//The host comes from req.get('host') ----> localhost:4000
      )}/password/reset/${resetPasswordToken}`;
  
      const message = `Reset Your Password by clicking on the link below: \n\n ${resetUrl}`;
  
      try {
        await sendEmail({//call and pass the data object sendemail func
          email: user.email,
          subject: "Reset Password",
          message,
        });
  
        res.status(200).json({
          success: true,
          message: `Email sent to ${user.email}`,
        });
      } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
  
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  exports.resetPassword = async (req, res) => {
    try {
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
      //const resetPasswordToken =req.params.token
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },//chck the expire time and current time $gt mean grate than{https://www.mongodb.com/docs/manual/reference/operator/query/gt/}
      });
  
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Token is invalid or has expired",
        });
      }
  
      user.password = req.body.password;
  
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Password Updated",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };