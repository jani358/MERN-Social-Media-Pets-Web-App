const Post = require("../models/Post.js")
const User = require("../models/User.js")

exports.createPost = async(req,res)=>{
    try {

      const newPostData = {//create user's post using his details(reqvest.body detais)
        caption:req.body.caption,
        image:{
            public_id:"req.body.pulic_id",
            url:"req.body.url"
        },
        owner:req.user._id
      }

      const post = await Post.create(newPostData)//create post and asign object post
      const user = await User.findById(req.user._id)//find relavant user using user's id 
      user.posts.push(post._id)//push the post id user's posts array
      await user.save()//Saves this document by inserting a new document into the database


      res.status(201).json({//send successs reqvest
        success:true,
        post,
      }) 

    } catch (error) {//send error
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.likeAndUnlikePost = async(req,res)=>{
       try {
         const post = await Post.findById(req.params.id)//find relavan post id post in database ,like/123
         
         if(!post){ //if we not find relavant post id then send error msg
           return res.status(404).json({
            success:false,
            message:"Post Not Found"
           })
         }

         if(post.likes.includes(req.user._id)){//check the current user id is in this array or not 

             const index = post.likes.indexOf(req.user._id)//user id is in this array.we check index of user id[121233,2243443,3535353]
             post.likes.splice(index,1)//1 mean remove the item relavant position(index of user id) , if we add 0 for 1 that me insert the element revant position. splice(2,1,"eee") that mean replace the elemant
             await post.save()
             return res.status(200).json({
              success:true,
              message:"Post Unliked"
            })
        }else{
          post.likes.push(req.user._id)//push the user id inside the post likes array
          await post.save()//save data in data base after push the id inside array
          return res.status(200).json({
            success:true,
            message:"Post liked"
          })
        } 
         
       } catch (error) {
         res.status(500).json({
          success:false,
          message:error.message
         })
       }
} 

exports.deletePost = async (req,res)=>{
  try {
    const post = await Post.findById(req.params.id)
    
    if(!post){ //if we not find relavant post id then send error msg
      return res.status(404).json({
       success:false,
       message:"Post Not Found" 
      })
    }

    if(post.owner.toString() !== req.user._id.toString()){//match the post owner is current user or not
        return res.status(401).json({//does not match then send respond [Unathorized user]
          success:false,
          message:"Unauthorized"
        })
    }

    await post.remove();
   
    const user = await User.findById(req.user._id)//assign to user variable relavan user's oblect[his name,his other.....]
    const index =  user.posts.indexOf(req.params.id)//finde the index of post in user model posts array [he pulished posts]
    user.posts.splice(index,1)//remove the post id in user's posts array
    await user.save()//after changes array we need to save current updated array in database


    res.status(200).json({
      success:true,
      message:"Post deleted"
    })

  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message
     })
  }
}

exports.updateCaption = async (req,res)=>{
  try {
    const post = await Post.findById(req.params.id)//get the post id in URI
    if(!post){//check the post exist or not
        return res.status(404).json({
            success:false,
            message:"Post Not Found"
        })
    }
  
    if(post.owner.toString() !== req.user._id.toString()){//match the post owner is current user or not
      return res.status(401).json({//does not match then send respond [Unathorized user]
        success:false,
        message:"Unauthorized"
      })
    }
  
    post.caption = req.body.caption//assign new caption[new caption get from the reqvest body]
    await post.save()
    res.status(200).json({
        success:true,
        message:"Caption Updated"
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message
     })
  }
 
}

// exports.commentOnPost = async(req,res) =>{
//   try {
//     const post = await Post.findById(req.params.id)

//     if(!post){
//       return res.status(404).json({
//         success:false,
//         message:"Post Not Found"
//       })
//     }

//     let commentExists = -1
//     //checking if comment already exists or not
//     post.comments.forEach((item, index) => {
//       console.log("dsd")
//       if (item.user.toString() === req.user._id.toString()) {
//         commentIndex = index;
//       }
//     });
    
//     if(commentExists !== -1){
//       post.comments[commentExists].comment = req.body.comment
       
//       await post.save()
//       return res.status(200).json({
//         success:true,
//         message:"Comment Updated"
//       })
//     }else{

//       post.comments.push({//Appends new elements to the end of an array, and returns the new length of the array.
//         user:req.user._id,
//         comment:req.body.comment
//       })
//       await post.save()
//       return res.status(200).json({
//         success:true,
//         message:"Comment Added"
//       })
//     }
   
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       success:false,
//       message:error.message
//      })
//   }
// }
exports.commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {

       return  res.status(404).json({
          success: false,
          message: "Post not found",
        });
      
    }
    
    let commentIndex = -1;

    // Checking if comment already exists

    post.comments.forEach((item, index) => {
     
      if (item.user.toString() === req.user._id.toString()) {    
        commentIndex = index;
      }
    });

    if (commentIndex !== -1) {
      post.comments[commentIndex].comment = req.body.comment;
      await post.save();

      return res.status(200).json({
        success: true,
        message: "Comment Updated",
      });
      
    } else {
      post.comments.push({
        user: req.user._id,
        comment: req.body.comment,
      });

      await post.save();
      return res.status(200).json({
        success: true,
        message: "Comment added",
      });
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

    // Checking If owner wants to delete
    exports.deleteComment = async (req, res) => {
      try {
        const post = await Post.findById(req.params.id);
    
        if (!post) {
          return res.status(404).json({
            success: false,
            message: "Post not found",
          });
        }
    
        // Checking If owner wants to delete
        let checkAccess =-1
        if (post.owner.toString() === req.user._id.toString()) {
          if (req.body.commentId === undefined) {
            return res.status(400).json({
              success: false,
              message: "Comment Id is required",
            });
          }
        
          post.comments.forEach((item, index) => {
            if (item._id.toString() === req.body.commentId.toString()) {
              return post.comments.splice(index, 1);
            }
          });
    
          await post.save();
    
          return res.status(200).json({
            success: true,
            message: "Selected Comment has deleted",
          });
        } else {
          post.comments.forEach((item, index) => {
            if (item.user.toString() === req.user._id.toString()) {
              checkAccess = 1
              return post.comments.splice(index, 1);
            }
            
          });
    
          await post.save();
    
          return res.status(200).json({
            success: true,
            message: "Your Comment has deleted",
          });
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }
