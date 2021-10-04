const db = require("../../data/db-config");

module.exports = {
  find,
  findById,
  insert,
  update,
  remove,
  findPostComments,
  findCommentById,
  insertComment,
};

function find() {
  const dbItems = db("posts");
  return dbItems;
}

function findById(id) {
  const foundPost = db("posts")
    .where({ id: Number(id) })
    .first();
  return foundPost;
}

function insert(post) {
  return db("posts")
    .insert(post)
    .then((ids) => ({
      id: ids[0],
      title: post.title,
      contents: post.contents,
    }));
}

function update(id, post) {
  const foundPost = db("posts")
  .where({ id: Number(id) })
  .first();
  return Promise.resolve()
    .then(() => db("posts").where("id", Number(id)).update(post))
    .then(() => {
      return foundPost;
    });
}

function remove(id) {
  const post = db("posts")
    .where({ id: Number(id) })
    .first();
  console.log(post)
  db("posts").where("id", Number(id)).del();
  
  return post;
}

function findPostComments(postId) {
  return db("comments")
    .join("posts", "posts.id", "post_id")
    .select("comments.*", "title as post")
    .where("post_id", postId);
}

function findCommentById(id) {
  return db("comments")
    .join("posts", "posts.id", "post_id")
    .select("comments.*", "title as post")
    .where("comments.id", id)
    .first();
}

function insertComment(comment) {
  return db("comments")
    .insert(comment)
    .then((ids) => ({ id: ids[0] }));
}
