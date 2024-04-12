const mongoose = require('mongoose');
const Comment = require('./comment.model');
const Schema = mongoose.Schema;

//Schema for submissions/store items. Store items are "submissions" in the code because both of these object types are similar enough.
const Submission = mongoose.model("submission", new Schema({
    title: { //The submission's title.
      type: String,
      default: ""
    },
    description: { //The submission's description.
      type: String,
      default: ""
    },
    tags: { //An array of tags; this is looked at when searching for submissions or listing related ones.
      type: [String],
      default: []
    },
    author: { //The submission's author; this user can modify the submission, delete it, or discontinue it if it is a Store Item.
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    submission_type: { //The type of submission.
      type: String,
      default: ""
    },
    categpry: { //The category of the submission (School Courses, College Courses, Training Material, Course Components, or Store Items).
      type: String,
      default: ""
    },
    topic: { //The main topic (subject) of the submission; this is ignored if the submission is a Store Item.
      type: String,
      default: ""
    },
    date_created: { //The date the submission was created. This is shown on the Submission Details page, and a "New!" badge will be shown if the date is 7 days or less (<= 168 hours) before the current date.
      type: Date,
      value: new Date()
    },
    last_updated: { //The date the submission was last updated. This is shown on the Submission Details page.
      type: Date,
      value: new Date()
    },
    comments: { //An array of IDs of comments that are visible below the submission page.
      type: [mongoose.Schema.Types.ObjectId],
      default: []
    },
    upvotes: { //The number of upvotes that the submission has recieved.
      type: Number,
      default: 0
    },
    favorites: { //The number of users that have "favorited" the submissions. Favorited submissions show up in the user's "Favorites" page.
      type: Number,
      default: 0
    },
    downvotes: { //The number of downvotes that the submission has recieved.
      type: Number,
      default: 0
    },
    difficulty: { //Courses/Course Components only; average "Difficulty" rating for the submission.
      type: Number,
      default: 0
    },
    _difficulty_ratings: [ //An array of individual "Difficulty" ratings.
        { key: mongoose.Schema.Types.ObjectId, value: Number }
    ],
    funness: { //Courses/Course Components only; average "Funness" rating for the submission.
      type: Number,
      default: 0
    },
    _funness_ratings: [ //An array of individual "Funness" ratings.
      { key: mongoose.Schema.Types.ObjectId, value: Number }
    ],
    min_grade: { //The minimum recommended grade for the submission; a value of 0 refers to Kindergarten; this is only used for School Courses.
      type: Number,
      default: 0
    },
    max_grade: { //The minimum recommended grade for the submission; a value of 0 refers to Kindergarten; this is only used for School Courses.
      type: Number,
      default: 12
    },
    mature_content: { //If true, the submission is marked as containing mature content; this is only intended for submissions targeted towards high-school and college students.
      type: Boolean,
      default: false
    },
    is_hidden: { //If true, the submission is hidden; this is usually used to hide submissions that violate the Terms of Service/Code of Conduct.
      type: Boolean,
      default: false,
    },
    is_featured: { //If true, the submission will show up at the top of the Submissions page.
      type: Boolean,
      default: false
    },
    is_exclusive: { //For Store Items only; if true, the item can only be obtained/purchased under certain conditions such as being a Backer; Backer-only items are still in the database to show them in a user's inventory.
      type: Boolean,
      default: false
    },
    is_discontinued: { //For Store Items only; if true, users will see a message saying "This item has been discontinued and can no longer be purchased", and will be unable to purchase the item.
      type: Boolean,
      default: false
    },
    is_seasonal: { //For Store Items only; if true, the item will only be purchaseable during a certain time period every year.
      type: Boolean,
      default: false
    },
    season_start_month: { //For Store Items only; the "month" portion of the date that a seasonal item becomes available.
      type: Number,
      value: 0,
    },
    season_end_month: { //For Store Items only; the "month" portion of the date a seasonal item becomes unavailable.
      type: Number,
      value: 0,
    },
    season_start_day: { //For Store Items only; the "day" portion of the date that a seasonal item becomes available.
      type: Date,
      default: null
    },
    season_end_day: { //For Store Items only; the "day" portion of the date a seasonal item becomes unavailable.
      type: Date,
      default: null
    },
    set_name: { //For Store Items only; the name of the set that the submission is a part of; all of the Store Items in a set will have their prices added up, and the price of the set will be half of the total price for each individual item.
      type: String,
      default: "None"
    },
    price: { //For Store Items only; the item's price in Acadicoins.
      type: Number,
      default: 0
    },
    url: { //The URL used when the submission is downloaded.
      type: String,
      default: ""
    },
    thumbnail: { //The URL for the submission's thumbnail/image.
      type: String,
      default: ""
    }
  }))

module.exports = Submission;