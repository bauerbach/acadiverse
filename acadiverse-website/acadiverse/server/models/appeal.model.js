const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema for ban/restriction appeals sent.
const Appeal = mongoose.model("appeal", new Schema({
  associated_username: { //The username of the account that this appeal is for.
    type: String,
    default: ""
  },
  appeal_text: { //The provided text for the appeal.
    type: String,
    default: ""
  },
  appeal_result: { //The appeal result; unreviewed/pending appeals have this value set to "NONE", accepted appeals have it set to "ACCEPTED", and denied appeals have it set to "DENIED".
    type: String,
    default: "NONE"
  }
}))

module.exports = Appeal;