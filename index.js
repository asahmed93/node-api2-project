const express = require('express')

const server = express()

server.use(express.json())

server.use("/api/posts", postRoutes);

server.use("/", (req,res) => {
    res.send("Success");
})

server.listen(port, () => {
    console.log(`server is running on port ${port}`)
});