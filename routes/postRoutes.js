const express = require('express')
const router = express.Router()
const db = require('../data/db')

router.post("/", (req,res) => {
    const newPost = req.body;
    if(!newPost.title || newPost.contents){
        res.status(400).send({ errorMessage: "Please provide title and contents for the post."})
    } else {
        db.insert(newPost)
        .then( post => {
            res.status(201).send(post)
        })
        .catch( err => {
            res.status(500).send({ error: "There was an error while saving the post to the database" })
        })
    }
})

router.post("/:id/comments", (req, res) => {
    const comment = req.body;

    if( !comment.text){
        res.status(400).send({ errorMessage: "Please provide text for the comment." })
    } else {
        db.insertComment(comment)
        .then( newComment => {
            if(newComment){
                res.status(201).send(newComment)
            } else {
                res.status(500).send({ error: "There was an error while saving the comment to the database" })
            }
        })
        .catch( err => res.status(404).send({ message: "The post with the specified ID does not exist." }))
    }
})

