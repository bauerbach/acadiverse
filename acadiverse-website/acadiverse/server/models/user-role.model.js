const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserRole = mongoose.model("user_role", new Schema({
	name: String
  }))

module.exports = UserRole;