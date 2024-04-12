const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ForumPost = require('./forum-post.model');

//Schema for Classroom Discussions; these are discussion boards that can also have courses associated with them.
const ClassroomDiscussion = mongoose.model("classroom_discussion", new Schema({
    name: { //The name of the discussion board.
      type: String,
      default: ""
    },
    teacher: { //The ID of the "Teacher"; this user can manage courses and has all permissions associated with this discussion board.
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    members: { //A list of user IDs for the members of this discussion board.
      type: [mongoose.Schema.Types.ObjectId],
      default: []
    },
    assignments: [ //An array of assignments.
      {
        assignment_id: { //The ID of the assignment; this corresponds to a Submission.
          type: mongoose.Schema.Types.ObjectId,
          default: null,
        },
        accepted: { //An array of IDs for users who have accepted the assginment.
          type: [mongoose.Schema.Types.ObjectId],
          default: []
        },
        completed: { //An array of IDs for users who have completed the assignment; this is verified through the Dashboard, which also tracks students' progress.
          type: [mongoose.Schema.Types.ObjectId],
          default: []
        }
      }
    ],
    posts: { //An array of IDs of discussion board posts; this references the schema for forum posts due to the similarity to posts on the Acadiverse Forum
      type: [mongoose.Schema.Types.ObjectId],
      default: []
    },
    filterMode: { //The filtering mode for this discussion board; BLOCK means that the post is not submitted and the user is given a forum strike, CENSOR means that swear words are replaced with asterisks, and CLEAN means that swear words are substituted; slurs are blocked regardless of filter mode.
      type: String,
      default: "BLOCK"
    },
    filterLevel: { //The filtering level for this discussion board. LOW blocks only strong words and slurs, MODERATE blocks many swear words, and "STRICT" also blocks "mild" swear words; slurs are always blocked regardless of filtering level.
      type: String,
      default: "STRICT"
    }
  }))

module.exports = ClassroomDiscussion;