const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")//Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
const cors = require('cors')
require("dotenv").config({ path: "backend/config/config.env" })


app.use(cors({ origin: '*' }))

//using middlewares
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({limit:'50mb', extended: true }))//function is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(cookieParser())
//importing routes
const post = require("./routes/post.js")
const user = require("./routes/user.js")
//using routes
app.use("/api/v1", post)
app.use("/api/v1", user)
app.use(express.static(path.join(__dirname, "../frontend/build")));


module.exports = app
