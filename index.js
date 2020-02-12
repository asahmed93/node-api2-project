const express = require('express')
const postRoutes = require("./routes/postRoutes")

const server = express()

server.use(express.json())

server.use("/api/posts", postRoutes);

server.use("/", (req,res) => {
    res.send("Success");
})


const port = 8000
server.listen(port, () => {
    console.log(`\n server is running on port ${port} \n`)
});  