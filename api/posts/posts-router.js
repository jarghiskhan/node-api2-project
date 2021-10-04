const express = require("express");
const Posts = require("./posts-model");
const router = express.Router()
// implement your posts router here
router.get("/", (req, res) => {
    Posts.find()
      .then((posts) => {
        res.status(200).json(posts);
      })
      .catch(() => {
        res.status(500).json({
          message: "The posts information could not be retrieved",
        });
      });
  });
  
  router.get("/:id", (req, res) => {
    const { id } = req.params;
    Posts.findById(id)
      .then((post) => {
        if (!post) {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist" });
        } else {
          res.status(200).json(post);
        }
      })
      .catch(() => {
        res
          .status(500)
          .json({ message: "The post information could not be retrieved" });
      });
  });
  
  router.post("/", (req, res) => {
    const newPost = req.body;
    if (!newPost.title || !newPost.contents) {
      res
        .status(400)
        .json({ message: "Please provide title and contents for the post" });
    } else {
      Posts.insert(newPost)
        .then((post) => {
          res.status(201).json(post);
        })
        .catch(() => {
          res.status(500).json({
            message: "There was an error while saving the post to the database",
          });
        });
    }
  });
  
  router.put("/:id", (req, res) => {
    const { id } = req.params;
    const postChanges = req.body;
    if (!postChanges.title || !postChanges.contents) {
      res
        .status(400)
        .json({ message: "Please provide title and contents for the post" });
    } else {
      Posts.update(id, postChanges)
        .then((post) => {
          if (!id) {
            res
              .status(404)
              .json({ message: "The post with the specified ID does not exist" });
          } else {
            res.status(200).json(post);
          }
        })
        .catch(() => {
          res
            .status(500)
            .json({ message: "The post information could not be modified" });
        });
    }
  });
  
  router.delete("/:id", (req, res) => {
    const { id } = req.params;
    Posts.remove(id)
      .then((post) => {
        if (!post) {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist" });
        } else {
          res.status(200).json(post);
        }
      })
      .catch(() => {
        res.status(500).json({ message: "The post could not be removed" });
      });
  });


  router.get("/:id/comments", (req, res) => {
    const {id} = req.params;
    Posts.findPostComments(id)
      .then((user) => {
        if (!user) {
          res.status(404).json({message: "The user with the specified ID does not exist"});
        } else {
          res.status(200).json(user);
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  });

  module.exports = router