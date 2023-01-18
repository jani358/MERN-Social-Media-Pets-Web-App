const app = require("./app.js")
const { connectDatabae } = require("./config/database.js")


connectDatabae()
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})