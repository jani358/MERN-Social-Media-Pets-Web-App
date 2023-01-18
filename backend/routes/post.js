const express = require("express");
const { 
      createPost, 
      likeAndUnlikePost, 
      deletePost, 
      updateCaption, 
      commentOnPost,
      deleteComment
} = require("../controllers/post");

const { isAutheticated } = require("../middleware/auth");

const router = express.Router()

router.route("/post/upload").post(isAutheticated,createPost)

router.route("/post/:id")

      .get(isAutheticated,likeAndUnlikePost)

      .delete(isAutheticated,deletePost)

      .put(isAutheticated,updateCaption)

router.route("/post/comment/:id")
      
      .put(isAutheticated,commentOnPost)

      .delete(isAutheticated,deleteComment)

module.exports = router;