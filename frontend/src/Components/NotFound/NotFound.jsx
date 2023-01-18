import { ErrorOutline } from "@mui/icons-material";
import { Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";
import png from '../../images/notfound.gif'
const NotFound = () => {
    return (
        <div className="notFound">
            <div className="notFoundContainer">
                <img src={png} alt="" />
                <Typography variant="h2" style={{ padding: "2vmax" }}>
                    Page Not Found
                </Typography>

                <Link to="/">
                    <Typography variant="h5">Go to Home</Typography>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;