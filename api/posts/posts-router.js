const express = require("express");
const Posts = require("./posts-model");
const router = express.Router();
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
  console.log(req.body.title)
  let foundPost;
  let newPost;
  Posts.findById(id).then((post) => {
    if (!post) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist" });
    } else {
      foundPost = post
      Posts.update(id, req.body)
        .then((post) => {
          if (!req.body.title || !req.body.contents) {
            res
              .status(400)
              .json({
                message: "Please provide the title and contents for the post",
              });
          } else{
            newPost = {...foundPost, title: req.body.title, contents: req.body.contents}
            res.status(200).json(newPost);
          }
        }).catch(()=>{
          res.status(400).json({message:"Please provide title and contents for the post"})
        })
    }
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  let deletedPost;
  Posts.findById(id).then((post) => {
    deletedPost = post;
    Posts.remove(id)
      .then((post) => {
        if (!post) {
          res.status(404).json({
            message: "The post with the specified ID does not exist",
          });
        } else {
          res.status(200).json(deletedPost);
        }
      })
      .catch(() => {
        res.status(500).json({ message: "The post could not be removed" });
      });
  });
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  Posts.findById(id).then((post) => {
    if (!post) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist" });
    } else {
      Posts.findPostComments(id)
        .then((post) => {
          res.status(200).json(post);
        })
        .catch((err) => {
          res.status(500).json({ message: err });
        });
    }
  });
});

module.exports = router;
