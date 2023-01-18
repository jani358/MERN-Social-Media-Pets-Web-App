const express = require("express");
const { 
    register,
    login,
    followUser, 
    logout, 
    updatePassword, 
    updateProfile, 
    deleteMyProfile, 
    myProfile,
    getUserProfile,
    getAllUsers,
    getPostFollowing,
    forgotPassword,
    resetPassword
} = require("../controllers/user");
const { isAutheticated } = require("../middleware/auth");


const router = express.Router();

router.route("/register").post(register)

router.route("/login").post(login)

router.route("/follow/:id").get(isAutheticated,followUser)

router.route("/logout").get(logout)

router.route("/update/password").put(isAutheticated,updatePassword)

router.route("/update/profile").put(isAutheticated,updateProfile)

router.route("/delete/me").delete(isAutheticated,deleteMyProfile)

router.route("/me").get(isAutheticated,myProfile)

router.route("/user/:id").get(isAutheticated,getUserProfile)

router.route("/posts").get(isAutheticated,getPostFollowing)

router.route("/users").get(isAutheticated,getAllUsers)

router.route("/forgot/password").post(forgotPassword)

router.route("/password/reset/:token").put(resetPassword)

module.exports = router;