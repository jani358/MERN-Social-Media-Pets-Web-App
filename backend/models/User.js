const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },

  avatar: {
    public_id: String,
    url: String,
  },

  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "Email already exists"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save",async function(next){//pre-save hook to encrypt the password while the document is being saved or if the password has changed during an update operation
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password,10)
  }
  next()//The next keywork refer to the next middleware that will run after yours to process the request. In the end of your function, you call next() to pass the control to the next middleware.
})

userSchema.methods.matchPassword = async function(password){// match password [after find user using email then we find relavant email password and user enter password are they match or not]
  //password -> user enter field password
  //this.password -> db password
  
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.genarateToken = function(){//genarate token 
  return jwt.sign({_id:this._id},process.env.JWT_SECRET)//we use jwt secret for this 
}

userSchema.methods.getResetPasswordToken = function () {//create reset password token
  const resetToken = crypto.randomBytes(20).toString("hex");//create random byete code

  this.resetPasswordToken = crypto
    .createHash("sha256")//Creates and returns a Hash object that can be used to generate hash digests using the given algorithm
    .update(resetToken)//Updates the hash content with the given data
    .digest("hex");//Calculates the digest of all of the data passed to be hashed (using the hash.update() method). If encoding is provided a string will be returned; otherwise a Buffer is returned.
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;//set token expire time

  return resetToken;
};

module.exports = mongoose.model("User",userSchema)