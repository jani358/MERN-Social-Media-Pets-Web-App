import { Button, Typography } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../Actions/User";
import User from "../User/User";
import "./Search.css";

const Search = () => {
    const [name, setName] = React.useState("");

    const { users, loading } = useSelector((state) => state.allUsers);

    const dispatch = useDispatch();
    useEffect(() => {


        dispatch(getAllUsers(name));

    }, [name])


    return (
        <div className="search">
            <form className="searchForm" >
                <Typography variant="h3" style={{ padding: "2vmax" }}>
                    PEtbOOK
                </Typography>

                <input
                    type="text"
                    value={name}
                    placeholder="Search Here Your Pet......."
                    required
                    onChange={(e) => setName(e.target.value)}
                />



                <div className="searchResults">
                    {users &&
                        users.map((user) => (
                            <User
                                key={user._id}
                                userId={user._id}
                                name={user.name}
                                avatar={user.avatar.url}
                            />
                        ))}
                </div>
            </form>
        </div>
    );
};

export default Search;