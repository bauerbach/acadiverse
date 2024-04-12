const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema for comments; the same one is used for all comments because they are the same everywhere in Acadiverse.
const Comment = mongoose.model("comment", new Schema({
    commenter: { //The ID of the user who posted the comment.
      type: mongoose.Schema.Types.ObjectID,
      default: null
    },
    commenter_avatar: { //The URL of the comment poster's avatar; this is used to minimize API requests.
      type: String,
      default: ""
    },
    date: { //The date the comment was posted.
      type: Date,
      default: new Date()
    },
    context: { //The type of content (submission, blog post, etc.) that the comment is associated with.
      type: String,
      default: "BLOG_POST"
    },
    parent_comment: { //The ID of the parent comment; this is null if the comment is top-level.
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    likes: { //The number of users who have "liked" the comment.
      type: Number,
      default: 0
    },
    hidden: { //If true, the comment is not visible and just shows "This comment was hidden by a moderator."; this is used if a moderator hides a comment.
      type: Boolean,
      default: false
    },
    edited: { //If true, the comment was edited and the word "Edited" will be shown next to the date.
      type: Boolean,
      default: false
    },
    replies: { //An array of IDs for the replies to this comment.
      type: [mongoose.Schema.Types.ObjectID],
      default: []
    },
    text: {
      type: String,
      default: ""
    }
}))
  
module.exports = Comment;