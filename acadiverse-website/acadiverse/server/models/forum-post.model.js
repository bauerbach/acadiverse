const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema for forum posts.
const ForumPost = mongoose.model("forum_post", new Schema({
    name: { //The title of this forum post.
      type: String,
      default: ""
    },
    author: { //The ID of the user who created this post (the OP).
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    category: { //The ID of the category (or Classroom Discussion) that this post belongs to; this is null if the post is a reply to another post.
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    is_classroom_discussion_post: { //If false, the post will be associated with a Classroom Discussion rather than the Acadiverse Forum.
      type: Boolean,
      default: false,
    },
    date_created: { //The date the post was created.
      type: Date,
      default: new Date()
    },
    replies: { //An array of IDs of replies to this post.
      type: [mongoose.Schema.Types.ObjectId],
      default: []
    },
    parent: { //The ID of the parent post; this is null if the post is top-level.
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    number_of_posts: { //The total number of replies; this reduces the load on the server/database when displaying the list of posts.
      type: Number,
      default: 0
    },
    post_contents: { //The Markdown code used to display the post.
      type: String,
      default: ""
    },
    is_locked: { //If this is true, users will not be able to reply to this post; posts are automatically locked if it has been 7889231 seconds (~3 months) since the last reply.
      type: Boolean,
      default: false
    },
    is_pinned: { //If this is true, the post will always be at the top of its category.
      type: Boolean,
      default: false
    }
  }))

module.exports = ForumPost;