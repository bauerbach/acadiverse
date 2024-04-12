/**
 * @file Methods for user authentication and roles.
 * @author Bradley Auerbach <bauerbach@gmail.com>
 * @version 1.0.0
 */

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const messages = require('../config/messages');
const db = require("../models");
const mongoose = require('mongoose');
const UserRoles = db.user_role;
const Account = require('../models/account.model');
const Comment = require('../models/comment.model');
const CourseProject = require('../models/course-project.model.js');
const ModeratorAction = require('../models/moderator-action.model');
const Submission = require('../models/submission.model');
const ClassroomDiscussion = require('../models/classroom-discussion.model');
const UserRole = require('../models/user-role.model');
const globalSettings = require('./global-settings');
const globals = require('../config/globals.js');

/**
 * Verifies a provided token and checks if the user is not banned from Acadiverse.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  let username = req.headers["username"];
  if (!token) {
    return res.status(403).send({ success: false, statusCode: 401, message: "A token must be provided." });    
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ success: false, statusCode: 401, message: "The provided token is invalid." })
    }
    req.userId = decoded.id;
    if(decoded.name === username) {
      let currentDate = new Date();
      Account.findOne({ username: username }).exec((err, user) => {
        if(!user) {
          return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", username)});
        }
        if(user.consent_required) {
          return res.status(401).send({ success: false, statusCode: 401, message: messages.consentRequired});
        }
        if(user.account_banned) {
          if(user.date_ban_expires.getFullYear() === 1970) {
            return res.status(401).send({ success: false, statusCode: 401, message: messages.accountPermabanned.replace("%1", user.ban_reason)});
          } else {
            if(user.date_ban_expires <= currentDate) {
              user.account_banned = false;
              var accountQuery = { username: username };
              var newData = { $set: { account_banned: false, ban_reason: "" } }
              Account.updateOne(accountQuery, newData, function(err, res) {
                if(err) throw err;
                var accountQuery = { username: username };
                var newData = { $set: { last_active: new Date() } }
                Account.updateOne(accountQuery, newData, function(err, res) {
                      if(err) throw err;
                    });
              });
            } else {
              return res.status(401).send({ success: false, statusCode: 401, message: messages.accountTempbanned.replace("%1", user.date_ban_expires).replace("%2", user.ban_reason)});
            }
          }
        } else {
          var accountQuery = { username: username };
          var newData = { $set: { last_active: new Date() } }
          Account.updateOne(accountQuery, newData, function(err, res) {
            if(err) throw err;
          });
          next(req, res);
        }
      });
    } else {
      return res.status(401).json({success: false, statusCode: 401, message: "The provided token does not match the provided user ID."});
    }
  });
};

/**
 * Check if all roles exist in the database and recreates any that don't.
 */
checkRoles = () => {
  UserRole.findOne({name: "users"}).then(role => {
    if(!role) {
      UserRole.create({name: "users"});
      console.log(`${new Date()}: Added role \"users\"`);
    }
  });

  UserRole.findOne({name: "moderators"}).then(role => {
    if(!role) {
      UserRole.create({name: "moderators"});
      console.log(`${new Date()}: Added role \"moderators\"`);
    }
  });

  UserRole.findOne({name: "admins"}).then(role => {
    if(!role) {
      UserRole.create({name: "admins"});
      console.log(`${new Date()}: Added role \"admins\"`);
    }
  });

  UserRole.findOne({name: "developers"}).then(role => {
    if(!role) {
      UserRole.create({name: "developers"});
      console.log(`${new Date()}: Added role \"developers\"`);
    }
  });
}

/**
 * Changes the rooles of a provided user.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
changeRoles = (req, res, next) => {
    if(req.query.username === "admin" || req.query.username === "acadiverse") {
      return res.status(400).json({success: false, statusCode: 400, message: "You cannot change roles for this account."});
    } else {
      Account.findOne({username: req.query.username}).then(account => {
        if(!account) {
          return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.query.username)});
        } else {
          var roles = ["users"];
          if(req.body.moderators) {
            roles.push("moderators");
          }
          if(req.body.admins) {
            roles.push("admins");
          }
          if(req.body.developers) {
            roles.push("developers");
          }
          Account.updateOne({ username: req.query.username }, { $set: { user_roles: roles } }, function(err, account) {
            if (err) return err;
            next(req, res);
          });
        }
      });
    }
}

/**
 * Checks if a user has the specified role.
 */
userHasRole = (username, role, next) => {
  Account.findOne({username: username}).exec((err, account) => {
    if (err) {
      return false;
    }
    var userRoles = account.user_roles;
    UserRoles.find(
      {
        name: { $in:userRoles }
      },
      (err, roles) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === role) {
            next(username, role, true);
            return;
          }
        }

        next(username, role, false);
      }
    );
  });
}

/**
 * Checks if a user has the "admins" role.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed if the user has the "admins" role.
 */
isAdmin = (req, res, next) => {
  userHasRole(req.headers["username"], "admins", function(userIsAdmin) {
    if(userIsAdmin) {
      next(req, res);
    } else {
      return res.status(403).send({ success: false, statusCode: 403, message: messages.noRole.replace("%1", "admins")});
    }
  });
};

/**
 * Checks if a user has the "moderators" role.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed if the user has the "moderators" role.
 */
isModerator = (req, res, next) => {
  userHasRole(req.headers["username"], "moderators", function(userIsModerator) {
    if(userIsModerator) {
      next(req, res);
    } else {
      res.status(403).send({ success: false, statusCode: 403, message: messages.noRole.replace("%1", "moderators")});
    }
  });
  
};

/**
 * Gives a provided user the specified role.
 */
addRole = (req, res, username, roleName, next) => {
  Account.findOne({username: username}, (err, user) => {
    UserRole.findOne({role_name: roleName}, (err, role) => {
      if(!role) {
        return res.status(404).json({success: false, statusCode: 404, message: "This role could not be found."});
      } else {
        user.user_roles.push(roleName);
        user.save();
      }
    });
  });
};

/**
 * Changes a provided user's password.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
changePassword = (req, res, next) => {
  if(req.body.newPassword.length < 8 || req.body.newPassword.length > 24) {
    return res.status(400).json({success: false, statusCode: 400, message: "Password must be between 8 and 24 characters long."});
  } else {
      if(Boolean(req.query.passwordChangedByAdmin)) {
        userHasRole(req.query.username, "admins", function(userIsAdmin) {
          if(userIsAdmin) {
            Account.findOne({username: req.query.username}).then(account => {
            if(!account) {
              return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", username)});
            } else {
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
                  Account.updateOne({udername: req.query.username}, {$set: {password: hash}}, function(err, res) {
                    if(err) throw err;
                    next(req, res);
                  });
                });
              });
            }
          });
          } else {
            res.status(403).send({ success: false, statusCode: 403, message: messages.noRole.replace("%1", "admins")});
          }
        });
      } else {
        Account.findOne({username: req.headers["username"]}).then(account => {
          if(!account) {
            return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", username)});
          } else {
            if(!account.acknowledged_last_warning) {
              return res.status(400).json({success: false, statusCode: 400, message: messages.activeWarning});
              } else {
                if(req.body.newPassword === req.body.confirmPassword) {
                  bcrypt.compare(req.body.currentPassword, account.password, (err, result) => {
                    if(result === true) {
                      bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
                          Account.updateOne({udername: re.headers["username"]}, {$set: {password: hash}}, function(err, res) {
                            if(err) throw err;
                            next(req, res);
                          });
                        });
                      });
                    } else {
                      return res.status(400).json({success: false, statusCode: 400, message: messages.invalidPassword});
                    }
                  });
                } else {
                  return res.status(400).json({success: false, statusCode: 400, message: messages.passwordMismatch});
                }
              next(req, res);
            }
          }
      });
    }
  }
};

/**
 * Adds to a user's infraction history.
 */
addToInfractionHistory = (moderatorName, associatedId, type, reason, req, res, next) => {
  ModeratorAction.create({
          moderator_name: moderatorName,
          associated_id: associatedId,
          action_type: type,
          reason: reason,
          date: new Date()
  }, function(err) {
    if (err) throw err;
    next(req, res);
  });
};

/**
 * Bans a provided account; banned users cannot log in to Acadiverse at all.
 */
banAccount = (moderatorName, banReason, dateBanExpires, req, res, next) => {
  Account.findOne({username: req.query.username}).exec((err, account) => {
    if(!account) {
      return;
    }
    var accountQuery = { username: req.query.username };
    var newData = { 
    $set: {
      account_banned: true, 
      ban_reason: banReason, 
      date_ban_expires: new Date(dateBanExpires),
      reputation_points: account.reputation_points + globals.REP_LOSS_BANNED
    } 
  };
    var accountId = account._id;
    Account.updateOne(accountQuery, newData, function(err, res) {
    if(err) throw err;
    console.log(new Date(dateBanExpires).getFullYear());
    if(new Date(dateBanExpires).getFullYear() === 1970) { //If the ban is permanent (permanent bans have the expiration date set to 1/1/1970)...
      this.addToInfractionHistory(
        moderatorName, 
        accountId, 
        "Permaban", 
        banReason, 
        req, res, 
        function(req, res) {
      });
    } else {
      this.addToInfractionHistory(
        moderatorName, 
        accountId,
        "Tempban", 
        banReason, 
        req, res, 
        function(req, res) {
      });
    }
  });
  });
  
  next(moderatorName, banReason, dateBanExpires, req, res);
};

/**
 * Unbans a provided account.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
unbanAccount = (req, res, next) => {
  var accountQuery = { username: req.query.username };
  var newData = { $set: {account_banned: false, ban_reason: "", dateBanExpires: new Date("1970-01-01")} }
  Account.updateOne(accountQuery, newData, function(err, res) {
    if(err) throw err;
  });
  next(req, res);
};

/**
 * Deletes a provided account.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
deleteAccount = (req, res, next) => {
  Account.findOne({username: req.headers["username"]}, (err, account) => {
    if(!account) {
      return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
    } else {
      if(!account.acknowledged_last_warning) {
        return res.status(400).json({success: false, statusCode: 400, message: messages.activeWarning});
      }
      if(req.headers["username"] === "admin") {
        return res.status(400).json({success: false, statusCode: 400, message: "You cannot delete the admin account."});
      }
      if(req.headers["username"] === "acadiverse") {
        return res.status(400).json({success: false, statusCode: 400, message: "You cannot delete the official Acadiverse account."});
      }
      bcrypt.compare(req.body.password, account.password).then(isMatch => {
        if (isMatch) {
          if(req.body.deletionReason === "") {
            return res.status(400).json({success: false, statusCode: 400, message: "Please provide us a reason for deleting your account."});
          }
          var id = account._id;
          Account.deleteOne({username: req.headers["username"]}).then(function() {
            CourseProject.deleteMany({$in: {collaborators: {collaborator: id, is_owner: true}}}).then(function() {

            });
            ClassroomDiscussion.deleteMany({author: id}).then(function() {

            });
            next(req, res);
          });
        } else {
            return res
              .status(400)
              .json({ success: false, statusCode: 400, message: messages.invalidPassword });
        }
      }); 
    }
  });
};

/**
 * Deletes an account if the provided user is an admin, optionally preventing the deleted account's username and/or email from being used again.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
deleteOtherAccount = (req, res, next) => {
  Account.findOne({username: req.query.username}, (err, account) => {
    if(!account) {
      return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
    } else {
      if(!account.acknowledged_last_warning) {
        return res.status(400).json({success: false, statusCode: 400, message: messages.activeWarning});
      }
      if(req.query.username === "admin") {
        return res.status(400).json({success: false, statusCode: 400, message: "You cannot delete the admin account."});
      }
      if(req.query.username === "acadiverse") {
        return res.status(400).json({success: false, statusCode: 400, message: "You cannot delete the official Acadiverse account."});
      }
      var username = account.username;
      var email = account.email;
      var id = account._id;
        Account.deleteOne({username: req.query.username}).then(function() {
          if(req.body.addUsernameToBlockList) {
            globalSettings.addToArray("usernameBlockList", username, res, function(key, value, res) {
              console.log(`${new Date()}: Added \"${username}\" to the username blocklist.`);
            });
          }
          if(req.body.addEmailToBlockList) {
            globalSettings.addToArray("emailBlockList", username, res, function(key, value, res) {
              console.log(`${new Date()}: Added \"${email}\" to the email blocklist.`);
            });
            CourseProject.deleteMany({$in: {collaborators: {collaborator: id, is_owner: true}}}).then(function() {

            });
            ClassroomDiscussion.deleteMany({author: id}).then(function() {

            });
          }
          if(req.body.deleteAllContent) {
            Submission.deleteMany({author: id}).then(function() {

            });
            
          }
          next(req, res);
        });
    }
  });
};

const authJwt = {
  verifyToken,
  checkRoles,
  userHasRole,
  changeRoles,
  isAdmin,
  isModerator,
  addRole,
  changePassword,
  addToInfractionHistory,
  banAccount,
  unbanAccount,
  deleteAccount,
  deleteOtherAccount
};
module.exports = authJwt;