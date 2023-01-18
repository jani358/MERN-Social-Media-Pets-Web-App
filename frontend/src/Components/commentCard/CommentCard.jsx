import React from 'react'
import { Delete } from "@mui/icons-material";
import './CommentCard.css'
import { Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { deleteCommentOnPost } from '../../Actions/Post';
import { getFollowingPosts, getMyPosts } from '../../Actions/User'
function CommentCard({
    userId,
    name,
    avatar,
    comment,
    commentId,
    postId,
    isAccount
}) {
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const deleteCommentHandle = () => {
        dispatch(deleteCommentOnPost(postId, commentId))

        if (isAccount) {
            dispatch(getMyPosts())
        } else {
            dispatch(getFollowingPosts())
        }
    }
    return (
        <div className='commentUser'>

            <Link to={`/user/${userId}`}>
                <img src={avatar} alt="" />
                <Typography variant='' style={{ minWidth: '6vmax' }} >{name}</Typography>
            </Link>

            <Typography>
                {comment}
            </Typography>

            {
                isAccount ? (
                    <Button onClick={deleteCommentHandle} >
                        <Delete />
                    </Button>
                ) : userId === user._id ? (
                    <Button onClick={deleteCommentHandle} >
                        <Delete />
                    </Button>
                ) : null
            }


        </div>
    )
}

export default CommentCard