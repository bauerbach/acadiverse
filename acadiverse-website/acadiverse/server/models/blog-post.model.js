const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = require('./comment.model');

//Schema for blog posts.
const BlogPost = mongoose.model("blog_post", new Schema({
    name: { //The post title; this is used in the URL and when checking links.
      type: String,
      default: ""
    },
    author: { //The name of the user who created the post.
      type: String,
      default: ""
    },
    date_created: { //The date the post was created.
      type: Date,
      default: new Date()
    },
    comments: { //An array of the IDs of comments on this post.
      type: [mongoose.Schema.Types.ObjectId],
      default: []
    },
    post_contents: { //The Markdown code used to display the post.
      type: String,
      default: ""
    },
    image: { //The path used to display the image for this blog post.
      type: String,
      default: ""
    },
    is_locked: { //If this is true, users will not be able to comment on this post.
      type: Boolean,
      default: false
    }
  }))

module.exports = BlogPost;