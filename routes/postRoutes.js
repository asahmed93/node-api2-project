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

router.get("/", (req,res) => {
    db.find()
    .then(posts => {
        res.status(200).send(posts)
    })
    .catch( err => {
        res.status(500).send({ error: "The posts information could not be retrieved." })
    })
})

router.get("/:id", (req, res) => {
    const {id} = req.params;

    db.findById(id)
    .then( post => {
        if(post){
            res.status(200).send(post)
        } else {
            res.status(404).send({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch( err => {
        res.status(500).send({ error: "The post information could not be retrieved." })
    })
})

router.get("/:id/comments", (req,res) => {
    db.findCommentById(req.params.id)
    .then( post => {
        if(post){
            res.status(200).send(post)
        } else {
            res.status(404).send({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch( err => {
        res.status(500).send({ error: "The comments information could not be retrieved." })
    })
})


router.delete("/:id", (req, res) => {
    const {id} = req.params;
    db.remove(id)
    .then( deleted => {
        if(deleted){
            res.status(204)
        } else {
            res.status(404).send({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(err => {
        res.status(500).send({ error: "The post could not be removed" })
    })
})

module.exports = router;