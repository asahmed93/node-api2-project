const express = require('express')

const router = express.Router()

const db = require('../data/db')

router.post("/", (req,res) => {
    const newPost = req.body;
    if(!newPost.title || !newPost.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post."})
    } else {
        db.insert(newPost)
        .then( post => {
            res.status(201).json(post)
        })
        .catch( err => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
    }
})

router.post('/:id/comments', (req,res) => {
    const {id} = req.params;
    const comment = {...req.body, post_id: id};

    if(!comment.text){
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else {
        db.findById(id)
            .then(post => {
                if(post.length){
                    db.insertComment(comment)
                    .then( data => {
                        res.status(201).json(data)
                    })
                    .catch( err => {
                        res.status(500).json({err})
                    })
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })
            .catch(err => {
                res.status(500).json({ error: "There was an error while saving the comment to the database" })
            })
        }
    }
)

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
        if(post.length === 0){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            res.status(200).json(post)
        }
    })
    .catch( err => {
        res.status(500).json({ error: "The post information could not be retrieved." })
    })
})

router.get("/:id/comments", (req,res) => {
    const {id} = req.params;

    db.findPostComments(id)
    .then(comments => {
        if(comments.length === 0){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            res.status(200).json(comments)
        }
    })
    .catch( err => {
        res.status(500).json({ error: "The comments information could not be retrieved." })
    })
})

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const { title, contents } = req.body;
    if(!title || !contents){
        res.status(400).json({errorMessage:'Post must conatin a title and contents'})
    } else{
        db.findById(id)
        .then(posts =>{
            db.update(id, req.body)
            .then(data =>{
                if(posts.length === 0){
                    res.status(404).json({message: "The post with the specified ID does not exist." })
                } else{
                    res.status(200).json(data)
                }
            })
            .catch(err =>{
                res.status(404).json({message: "The post with the specified ID does not exist."})
            })
        })
        .catch(err =>{
            res.status(500).json({errorMessage:'Post does not exist'})
        })
    }
})


router.delete("/:id", (req, res) => {
    const {id} = req.params;
    db.remove(id)
    .then( deleted => {
        if(deleted){
            res.status(204).end()
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }  
    })
    .catch(err => {
        res.status(500).json({ error: "The post could not be removed" })
    })
})
  
module.exports = router;