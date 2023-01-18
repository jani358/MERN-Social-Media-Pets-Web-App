import React, { useEffect, useContext, useState } from 'react'
import { Dialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { deleteMyProfile, getMyPosts, logoutUser } from '../../Actions/User'
import Loader from '../Loader/Loader'
import User from '../User/User'
import './Account.css'
import { useAlert } from 'react-alert'
import Post from '../Post/Post'
import { Avatar, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { SideBarOpenCloseContext } from '../../context/SideBarOpenClose'
function Account() {
    const { user, loading: userLoading } = useSelector((state) => state.user)
    const { sideBarMode } = useContext(SideBarOpenCloseContext)
    const [followersToggle, setFollowersToggle] = useState(false)
    const [followingToggle, setFollowingToggle] = useState(false)
    //console.log(sideBarMode)
    const alert = useAlert()
    const dispatch = useDispatch()

    const { loading, error, posts } = useSelector((state) => state.myPosts)
    const { error: likeError, message, loading: deleteLoading } = useSelector((state) => state.like)
    useEffect(() => {
        dispatch(getMyPosts())
    }, [alert, likeError, message, dispatch, error])
    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch({ type: "clearErrors" })
        }
        if (likeError) {
            alert.error(likeError)
            dispatch({ type: "clearErrors" })
        }
        if (message) {
            alert.success(message)
            dispatch({ type: "clearMessage" })
        }
    }, [alert, likeError, message, dispatch, error,])
    // {sideBarMode ? 'account-visible' : 'account'}

    const logoutHandler = () => {
        dispatch(logoutUser())
        alert.success("Logged out Successfully")
    }
    const deleteAccountHandler = async () => {
        dispatch(deleteMyProfile())
        dispatch(logoutUser())
    }
    return loading === true || userLoading === true ?
        <Loader /> :
        (
            <div className={sideBarMode ? 'account-visible' : 'account'}>
                <div className="accountleft">

                    {
                        posts && posts.length > 0 ? posts.map((post) => (
                            <Post
                                key={post._id}
                                postId={post._id}
                                caption={post.caption}
                                postImage={post.image.url}
                                likes={post.likes}
                                comments={post.comments}
                                ownerImage={post.owner.avatar.url}
                                ownerName={post.owner.name}
                                ownerId={post.owner._id}
                                isAccount={true}
                                isDelete={true}
                            />
                        )) : <Typography variant='h4'>No Post Yet...</Typography>
                    }

                </div>
                <div className="accountright">
                    <Typography>{user.name}</Typography>
                    <Avatar
                        src={user.avatar.url}
                        sx={{ height: "8vmax", width: "8vmax" }}
                    ></Avatar>

                    <div>
                        <button onClick={() => setFollowersToggle(!followersToggle)}>
                            <Typography>Followers</Typography>
                        </button>
                        <Typography style={{ fontWeight: "700" }}>{user.followers.length}</Typography>
                    </div>

                    <div>
                        <button onClick={() => setFollowingToggle(!followingToggle)}>
                            <Typography>Following</Typography>
                        </button>
                        <Typography style={{ fontWeight: "700" }}>{user.following.length}</Typography>
                    </div>

                    <div>
                        <Typography style={{ fontWeight: "700" }}>Posts</Typography>
                        <Typography style={{ fontWeight: "700" }}>{user.posts.length}</Typography>
                    </div>

                    <Button onClick={logoutHandler} variant='contained'>Logout</Button>

                    <Link to='/update/profile'>Edit Profile</Link>
                    <Link to='/update/password'>Chanage Password</Link>

                    <Button
                        onClick={deleteAccountHandler}
                        disabled={deleteLoading}
                        variant='text'
                        style={{ color: "red", margin: "2vmax" }}
                    >
                        Delete My Profile
                    </Button>
                    <Dialog open={followersToggle} onClose={() => setFollowersToggle(!followersToggle)}>
                        <div className="DialogBox">
                            <Typography variant='h4'>Followers</Typography>
                            {
                                user && user.followers.length > 0 ? (
                                    user.followers.map((follower) => (
                                        <User
                                            key={follower._id}
                                            userId={follower._id}
                                            name={follower.name}
                                            avatar={follower.avatar.url}
                                        />
                                    ))
                                ) : <Typography>You Have No Followers</Typography>

                            }
                        </div>
                    </Dialog>

                    <Dialog open={followingToggle} onClose={() => setFollowingToggle(!followingToggle)}>
                        <div className="DialogBox">
                            <Typography variant='h4'>Following</Typography>
                            {
                                user && user.following.length > 0 ? (
                                    user.following.map((followin) => (
                                        <User
                                            key={followin._id}
                                            userId={followin._id}
                                            name={followin.name}
                                        // avatar={followin.avatar.url}
                                        />
                                    ))
                                ) : <Typography>You Have No Followings</Typography>

                            }
                        </div>
                    </Dialog>
                </div>
            </div>
        )
}

export default Account