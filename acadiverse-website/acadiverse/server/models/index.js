const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.account = require("./account.model");
db.user_role = require("./user-role.model");

db.USER_ROLES = ["user", "moderator", "admin", "submission_curator", "developer"];

module.exports = db;