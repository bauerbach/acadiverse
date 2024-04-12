const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Schema for moderator actions (warnings, bans, etc.); this is used so that deleting accounts does not clear the infraction history.
const ModeratorAction = mongoose.model("moderator_action", new Schema({
    moderator_name:
    {
      type: String,
      default: ""
    },
    associated_id: //The ID of the user that this moderator acttion is for; this is used so that a user cannot escape from their infraction history simply by changing their username.
    {
      type: mongoose.Schema.Types.ObjectId,
      default: ""
    },
    action_type: //The type of action that was performed.
    {
      type: String,
      default: "Warning"
    },
    reason: //The reason for the action.
    {
      type: String,
      value: ""
    },
    date: //The date the action was performed.
    {
      type: Date,
      value: new Date()
    }
  }))
  
module.exports = ModeratorAction;