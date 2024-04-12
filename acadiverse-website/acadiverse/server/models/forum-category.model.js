const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema for forum categories.
const ForumCategory = mongoose.model("forum_category", new Schema({
    name: { //The category title; this is used in the URL (http://www.acadiverse.com/forum?category=[id]&post=[id]).
      type: String,
      default: ""
    },
    description: { //The category description; this is shown on the Forum Categories page.
      type: String,
      default: ""
    },
    subcategories: { //An array of subcategory IDs.
      type: [mongoose.Schema.Types.ObjectId],
      default: []
    },
    parent_category: { //The ID of the parent category, or null if the category is top-level.
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    is_locked: { //If this is true, users (including moderators/admins) will not be able to post or reply to posts in this category (i.e. the category is read-only/archived).
      type: Boolean,
      default: false
    },
    moderator_only: { //If this is true, only moderators will be able to post in this category.
      type: Boolean,
      default: false
    },
    last_post: { //The ID of the most recent post in the category; this makes it easier to determine when the last post date was.
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    number_of_posts: { //The total number of posts; this reduces the load on the server/database when displaying the category list.
      type: Number,
      default: 0
    }
  }))

module.exports = ForumCategory;