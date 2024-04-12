/**
 * @file Methods for the management of Acadiverse accounts.
 * @author Bradley Auerbach <bauerbach@gmail.com>
 * @version 1.0.0
 */

const db = require("../models");
const mongoose = require('mongoose');
const UserRoles = db.user_role;
const Account = require('../models/account.model');
const messages = require('../config/messages');
const bcrypt = require('bcrypt');
const globals = require("../config/globals");
const globalSettings = require('../middlewares/global-settings');
const Submission = require("../models/submission.model");

/**
 * Restores the admin account if it doesn't exist in the database.
 */
restoreAdminAccount = () => {
  Account.findOne({username: "admin"}).then(account => {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 32) {
    randomString += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
    if(!account) {
      var accountCreationDateString = "";
      var currentDate = new Date();
      var month = currentDate.getMonth() + 1;
      var date = currentDate.getDate();
      var m = "";
      var d = "";
      if(currentDate.getMonth() < 10) {
        m = "0" + month;
      } else {
        m = month + 1;
      }

      if(currentDate.getDate() < 10) {
        d = "0" + date;
      } else {
        d = date;
      }

      accountCreationDateString = m + "/" + d;


      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(randomString, salt, (err, hash) => {
          Account.create(
          {
            username: "admin",
            display_name: "Admin",
            password: hash,
            email: "support@acadiverse.com",
            birthday: "01/01/2001",
            birthday_date: "01/01",
            account_creation_date: new Date(),
            member_anniversary_date: accountCreationDateString,
            last_active: new Date(),
            user_roles: ["users", "moderators", "admins"],
            onboarding_completed: true,
            reputation_points: 2147483647,
            money: 2147483647
          }, function(err, user) {

            if(err) return res.status(500).json({success: false, statusCode: 500, message: "The server has encountered an error."});
            const payload = {
              id: user.id,
              name: user.username
            };
            jwt.sign(
              payload,
              authConfig.secret,
              {
                expiresIn: 31556926
              },
              (err, token) => {
                
              }
            );
          });
        });
      });
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(randomString, salt, (err, hash) => {
          //Restore the default settings in the event of any changes made in the database.
          Account.updateOne({username: "admin"},
          { $set: {
            username: "admin",
                display_name: "Admin",
                password: hash,
                email: "support@acadiverse.com",
                birthday: "01/01/2001",
                birthday_date: "01/01",
                account_creation_date: new Date(),
                member_anniversary_date: accountCreationDateString,
                last_active: new Date(),
                user_roles: ["users", "moderators", "admins"],
                onboarding_completed: true,
                reputation_points: 2147483647,
                money: 2147483647
          }}, function(err, account) {
            
          });
        });
      });
    }
  });
}

/**
 * Restores the official Acadiverse account if it does not exist in the database.
 */
restoreOfficialAcadiverseAccount = () => {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 32) {
    randomString += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  Account.findOne({username: "acadiverse"}).then(account => {
    if(!account) {
      var accountCreationDateString = "";
      var currentDate = new Date();
      var month = currentDate.getMonth() + 1;
      var date = currentDate.getDate();
      var m = "";
      var d = "";
      if(currentDate.getMonth() < 10) {
        m = "0" + month;
      } else {
        m = month + 1;
      }

      if(currentDate.getDate() < 10) {
        d = "0" + date;
      } else {
        d = date;
      }

      
      accountCreationDateString = m + "/" + d;
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(randomString, salt, (err, hash) => {
          Account.create(
          {
            username: "acadiverse",
            display_name: "Acadiverse",
            password: hash,
            email: "support@acadiverse.com",
            account_type: "Student",
            birthday: "09/02/2025",
            birthday_date: "09/02",
            account_creation_date: new Date(),
            member_anniversary_date: accountCreationDateString,
            last_active: new Date(),
            user_roles: ["users", "moderators", "admins"],
            receives_pms: false,
            profile_bio: "This is the official account for Acadiverse, used to send automated PMs and give gifts to users on their birthday/member anniversary."
          }, function(err, user) {

            if(err) return res.status(500).json(
              {
                success: false, 
                statusCode: 500, 
                message: "The server has encountered an error."
              }
            );
            globalSettings.setString("officialAccountId", user._id, null, function(key, value, res) {
              
            });
            const payload = {
              id: user.id,
              name: user.username
            };
            jwt.sign(
              payload,
              authConfig.secret,
              {
                expiresIn: 31556926
              },
              (err, token) => {
                
              }
            );
          });
        });
      });
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(randomString, salt, (err, hash) => {
          //Restore the default settings in the event of any changes made in the database.
          Account.updateOne({username: "acadiverse"},
          { $set: {
            display_name: "Acadiverse",
            password: hash,
            email: "support@acadiverse.com",
            account_type: "Student",
            birthday: "09/02/2025",
            birthday_date: "09/02",
            account_creation_date: new Date(),
            member_anniversary_date: accountCreationDateString,
            last_active: new Date(),
            user_roles: ["users", "moderators", "admins"],
            receives_pms: false,
            profile_bio: "This is the official account for Acadiverse, used to send automated PMs and give gifts to users on their birthday/member anniversary.",
            account_banned: false,
            ban_reason: "",
            date_ban_expires: new Date(1970, 1, 1),
            acknowledged_last_warning: true,
            date_last_warning_received: new Date(1970, 1, 1),
            last_warned_by_moderator_name: "",
            last_warning_reason: "",
            reputation_points: 2147483627,
            money: 2147483647
          }}, function(err, account) {
            
          });
        });
      });
    }
  });
}

/**
 * Sends a PM as the official Acadiverse account.
 * @param {Object} recipient - The ID of the recipient.
 * @param {string} message - The message to be sent.
 * @param {function} next - The function to be executed after the message is sent.
 */
sendPMAsAcadiverse = (recipient, message, next) => {
  Account.findOne({id: recipient}, function(err, account) {
    globalSettings.retrieveString("officialAccountId", null, function(key, res, officialAccountId) {
      this.sendPM(officialAccountId, account._id, message, null, function(message) {
        console.log(`Sent the following message to ${account.display_name} (${account.username}): ${message}`);
        next(recipient, message);
      })
    });
  });
}

/**
 * Sends a PM to a user on behalf of another user.
 * @param {Object} sender - The ID of the sender.
 * @param {Object} recipient - The ID of the recipient.
 * @param {string} message - The message to be sent.
 * @param {Object} res - The response given by the server.
 * @param {function} next The function to be executed after the message is sent.
 */
sendPM = (sender, recipient, message, res, next) => {
  var senderUsername = "";
  var recipientUsername = "";
  var recepientRecievedPMs = true;
  Account.findById(sender, (err, account) => {
    if(!account) {
      if(!res) {
        console.log(`${new Date()}: Sender was not found.`);
        return;
      } else {
        return res.status(404).json({success: false, statusCode: 404, message: messages.idNotFound.replace("%1", sender)});
      }
    }

    if(account.account_banned) {
      if(!res) {
        console.log(`${new Date()}: Sender is banned from Acadiverse.`);
        console.log(`${new Date()}: Sender:`, account.username);
      } else {
        return res.status(403).json({success: false, statusCode: 403, message: "Your account is banned."});
      }
    }

    if(!account.acknowledged_last_warning) {
      if(!res) {
        console.log(`${new Date()}: Sender has an active warning.`);
        console.log(`${new Date()}: Sender:`, account.username);
        return;
      } else {
        return res.status(403).json({success: false, statusCode: 403, message: messages.activeWarning});
      }
    }
    senderUsername = account.username;
    senderDisplayName = account.displayName;
    
    Account.findById(recipient, (err, account) => {
    if(!account) {
      if(!res) {
        console.log(`${new Date()}: Recipient was not found.`);
        return;
      } else {
        return res.status(404).json({success: false, statusCode: 404, message: messages.idNotFound.replace("%1", recipient)});
      }         
    }
    recipientUsername = account.username;
    recipientDisplayName = recipient.displayName;
    recipientRecievesPMs = account.receives_pms;

    var senderIsModerator = false;
    var senderIsAdmin = false;
    var senderIsBlocked = false;
    
    authJwt.userHasRole(senderUsername, "moderators", function(id, role, userIsModerator) {
      senderIsModerator = userIsModerator;
    })

    authJwt.userHasRole(senderUsername, "admins", function(id, role, userIsAdmin) {
      senderIsAdmin = userIsAdmin;
    });
    
    checkBlockedUsers(sender, recipient, function(sender, recipient, blocked) {
      senderIsBlocked = blocked;  
    });

    if(senderIsBlocked && !senderIsModerator && !senderIsAdmin) {
      if(!res) {
        console.log(`${new Date()}: Sender was in recipient's blocklist.`);
        return;
      } else {
        return res.status(400).send({ success: false, statusCode: 400, message: messages.pmUserBlocked});
      }
    }
    
    if(!recipientRecievesPMs && !senderIsModerator && !senderIsAdmin) {
      if(!res) {
        console.log(`${new Date()}: Recipient has opted out of recieving PMs from users who are not moderators or admins.`);
        return; 
      } else {
        return res.status(400).send({ success: false, statusCode: 400, message: messages.pmUserOptedOut });
      }
    }
      
    var accountQuery = { _id: recipient };
    var newData = { 
      $push: { 
        private_messages: {
          senders: {
            
          }
        }
      }  
    };
    Account.updateOne(accountQuery, newData, function(err, res) {
        if(err) throw err;
        console.log(`${new Date()}: Updated data for account ${recipientUsername}`);
    });
    accountQuery = { _id: sender };
    Account.updateOne(accountQuery, newData, function(err, res) {
        if(err) throw err;
    });
    notifyUser(recipientUsername, "PMRecieved", "", senderUsername, "", "", function(username) {
      next(sender, recipient, message, res);
    });
    });
  });
};

/**
 * Sends a user a notification.
 * @param {string} username - The username of the user to send a notification to.
 * @param {string} notificationType - The type of notification.
 * @param {string} context - The context of the notification.
 * @param {string} s1 - Replacement for "%1" in the notification message.
 * @param {string} s2 - Replacement for "%2" in the notification message.
 * @param {string} s3 - Replacement for "%3" in the notification message.
 * @param {function} next - The function to be executed after sending the notification.
 */
notifyUser = (username, notificationType, context, s1, s2, s3, next) => {
  Account.findOne({username: username}, (err, account) => {
    if(!account) {
      return;
    } else {
      var notificationText = "";
      switch(notificationType) {
        case "Mentioned":
          if(account.notify_mentioned) {
            switch(context) {
              case "Comments":
                notificationText = messages.commentsMentionedNotification.replace("%1", s1).replace("%2", s2).replace("%3", s3);
                break;
              case "ForumPost":
                notificationText = messages.forumMentionedNotification.replace("%1", s1).replace("%2", s2).replace("%3", s3);
                break;
              default:
                return;
            }
          } else {
            return;
          }
          break;
        case "AchievementRecieved":
        if(account.notify_achievement_recieved) {
            notificationText = messages.achievementRecievedNotification.replace("51", s1);
          } else {
            return;
          }
          break;
        case "SubmissionFeatured":
        if(account.notify_submission_featured) {
            notificationText = messages.submissionFeaturedNotification.replace("%1", s1).replace("%2", s2);
          } else {
            return;
          }
          break;
        case "SubmissionComment":
        if(account.notify_submission_comment) {
            notificationText = messages.submissionCommentNotificationCommentNotification.replace("%1", s1).replace("%2", s2).replace("%3", s3);
          } else {
            return;
          }
          break;
        case "SubmissionUpvote":
        if(account.notify_submission_upvote) {
            notificationText = messages.submissionUpvoteMilestoneNotificationCommentNotification.replace("%1", s1).replace("%2", s2).replace("%3", s3);
          } else {
            return;
          }
          break;
        case "PMRecieved":
        if(account.notify_pm_recieved) {
            notificationText = messages.pmRecievedNotification.replace("%1", s1);
          } else {
            return;
          }
          break;
        default:
          return;
      }

      var accountQuery = {username: username};
      var newData = {
        $push: {
          notifications: {
            date: new Date(),
            read: false,
            text: notificationText
          }
        }
      }
      Account.updateOne(accountQuery, newData, function(err, res) {
        if(err) throw err;
        next(username);
      });
    }
  });
}

/**
 * Updates an account's Acadicoins (money), Reputation Points, and owned items.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The function to be executed when exiting the method.
 */
updateData = (req, res, next) => {
    var username = req.query.username;
    var accountQuery = { username: username };
    var newData = { 
      $set: { 
        reputation_points: req.body.reputationPoints, 
        money: req.body.money
      } 
    };
    Account.updateOne(accountQuery, newData, function(err, res1) {
        if(err) throw err;
        next(req, res);
    });
};

/**
 * Changes the settings for an account.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The function to be executed when exiting the method.
 */
changeSettings = (req, res, next) => {
  var username = req.headers["username"];
  checkForWarning(req, res, function(req1, res1) {
    console.log(req1.body);
    var accountQuery = ( { username: username } );
    var newData = { $set: {
      display_name: req1.body.newDisplayName,
      profile_bio: req1.body.profileBio,
      gender: req1.body.gender,
      genderPronoun: req1.body.gender_pronoun,
      notify_achievement_received: req1.body.notifyAchievementReceived,
      notify_submission_featured: req1.body.notifySubmissionFeatured,
      notify_submission_comment: req1.body.notifySubmissionComment,
      notify_submission_upvote: req1.body.notifySubmissionUpvote,
      notify_pm_received: req1.body.notifyPMReceived,
      profile_image_url: req1.body.profileImageURL,
      uses_gravatar: req1.body.usesGravatar
    }};
    Account.updateOne(accountQuery, newData, function(err, res) {
      if(err) throw err;
      next(req1, res1);
    });
  });
}

/**
 * Allows a moderator or an admin to edit another user's profile.
 */
editProfile = (req, res, next) => {
  checkForWarning(req, res, function(req, res) {
    Account.findOne({username: req.query.username}, (err, account) => {
      if(!account) {
        return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.query.username)});
      }
        console.log(req.body);
        var accountQuery = ( { username: req.query.username } );
        var newData = { 
          $set: {
            username: req.body.username,
            display_name: req.body.displayName,
            profile_bio: req.body.profileBio
          }
        };
        Account.updateOne(accountQuery, newData, function(err, res) {
          if(err) throw err;
          
          next(req, res);
        });
    });
  })
}

/**
 * Changes the avatar of a user.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The function to be executed when exiting the method.
 */
changeAvatar = (req, res, next) => {
  checkForWarning(req, res, function(req, res) {
    Account.findById(req.query.accountId, (err, account) => {
      if(!account) {
        res.status(404).json({success: false, statusCode: 404, message: messages.idNotFound});
      }
      if(isNaN(req.body.skinColor)) {
        res.status(400).json({success: false, statusCode: 400, message: "The ID for the skin color must be a number."});
      }

      Submission.findOne({_id: req.body.hat}, (err, submission) => {
        if(!submission) {
          res.status(404).json({success: false, statusCode: 404, message: "The \"Hat\" item you tried to use does not exist."});
        }
        if(!account.owned_items.indexOf(req.body.hat) === -1) {
          return res.status(400).json({success: false, statusCode: 400, message: messages.avatarItemUnavailable});
        }
      });

      Submission.findOne({_id: req.body.hairStyle}, (err, submission) => {
        if(!submission) {
          res.status(404).json({success: false, statusCode: 404, message: "The \"Hair Style\" item you tried to use does not exist."});
        }
        if(!account.owned_items.indexOf(req.body.hairStyle) === -1) {
          return res.status(400).json({success: false, statusCode: 400, message: messages.avatarItemUnavailable});
        }
      });

      Submission.findOne({_id: req.body.facialHair}, (err, submission) => {
        if(!submission) {
          res.status(404).json({success: false, statusCode: 404, message: "The \"Facial Hair\" item you tried to use does not exist."});
        }
        if(!account.owned_items.indexOf(req.body.facialHair) === -1) {
          return res.status(400).json({success: false, statusCode: 400, message: messages.avatarItemUnavailable});
        }
      });

      Submission.findOne({_id: req.body.eyewear}, (err, submission) => {
        if(!submission) {
          res.status(404).json({success: false, statusCode: 404, message: "The \"Eyewear\" item you tried to use does not exist."});
        }
        if(!account.owned_items.indexOf(req.body.eyewear) === -1) {
          return res.status(400).json({success: false, statusCode: 400, message: messages.avatarItemUnavailable});
        }
      });

      Submission.findOne({_id: req.body.top}, (err, submission) => {
        if(!submission) {
          res.status(404).json({success: false, statusCode: 404, message: "The \"Top\" item you tried to use does not exist."});
        }
        if(!account.owned_items.indexOf(req.body.top) === -1) {
          return res.status(400).json({success: false, statusCode: 400, message: messages.avatarItemUnavailable});
        }
      });

      Submission.findOne({_id: req.body.top}, (err, submission) => {
        if(!submission) {
          res.status(404).json({success: false, statusCode: 404, message: "The \"Bottom\" item you tried to use does not exist."});
        }
        if(!account.owned_items.indexOf(req.body.bottom) === -1) {
          return res.status(400).json({success: false, statusCode: 400, message: messages.avatarItemUnavailable});
        }
      });
      
      Submission.findOne({_id: req.body.top}, (err, submission) => {
        if(!submission) {
          res.status(404).json({success: false, statusCode: 404, message: "The \"Footwear\" item you tried to use does not exist."});
        }
        if(!account.owned_items.indexOf(req.body.footwear) === -1) {
          return res.status(400).json({success: false, statusCode: 400, message: messages.avatarItemUnavailable});
        }
      });
    });
    var accountQuery = ( { _id: req.query.accountId } );
    var newData = { 
      $set: {
        avatar: {
          skinColor: req.body.skinColor,
          hat: req.body.hat,
          hairStyle: req.body.hairStyle,
          facialHair: req.body.facialHair,
          eyewear: req.body.eyewear,
          top: req.body.top,
          bottom: req.body.bottom,
          footwear: req.body.footwear
        } 
      }
    };
    Account.updateOne(accountQuery, newData, function(err, res) {
      if(err) throw err;
      next(req, res);
    });
  })
  
}

/**
 * Checks if the specified user is in the other specified user's blocklist.
 * @param {object} user - The ID of the user to check for in the other user's blocklist.
 * @param {object} otherUser - The ID of the user whose blocklist to check.
 * @param {function} next - The function to be executed if the user is not in the other user's blocklist.
 */
checkBlockedUsers = (user, otherUser, next) => {
  var blocked = false;
  Account.findById(otherUser).exec((err, account) => {
      if (err) {
        res.status(500).send({ message: err });
      }

      Account.find(
        {
          _id: { $in: account.blocked_users }
        },
        (err, blockedUsers) => {
          if (err) {
            res.status(500).send({ message: err });
          }

          for (let i = 0; i < blockedUsers.length; i++) {
            if (blockedUsers[i] === user) {
              blocked = true;
            }
          }
        }
      );
      next(user, otherUser, blocked);
    });  
}

/**
 * Adds a user ID to a user's blocklist.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The function to be executed when exiting the method.
 */
blockUser = (req, res, next) => {
  Account.findOne({username: req.headers["username"]}, (err, account) => {
    if(!account) {
      return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
    }
    Account.findById(req.query.id).exec((err, otherAccount) => {
      if(!otherAccount) {
        return res.status(404).json({success: false, statusCode: 404, message: messages.idNotFound.replace("%1", req.query.id)});
      }
      if(otherAccount._id === account._id) {
        return res.status(400).json({success: false, statusCode: 400, message: "You cannot block yourself, silly!"});
      }
      globalSettings.retrieveString("officialAccountId", res, function(key, res, officialAccountId) {
        if(otherAccount._id === officialAccountId) {
          return res.status(400).json({success: false, statusCode: 400, message: "If you block the official Acadiverse account, you will not recieve anything for your birthday or member anniversary!"});
        }
      });
      Account.updateOne({username: req.headers["username"]}, { $push: {blocked_users: req.query.id}, $pull: {buddies: req.query.id} }, (err, account) => {
        if(err) throw err;
        next(req, res);
      });
    });
  });
};

/**
 * Removes a user ID from a user's blocklist.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The function to be executed when exiting the method.
 */
unblockUser = (req, res, next) => {
  Account.findOne({username: req.headers["username"]}, (err, account) => {
    if(!account) {
      return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
    }
    Account.findById(req.query.id).exec((err, otherAccount) => {
      if(!otherAccount) {
        return res.status(404).json({success: false, statusCode: 404, message: messages.idNotFound.replace("%1", req.query.id)});
      }
      Account.updateOne({username: req.headers["username"]}, { $pull: {blocked_users: req.query.id} }, (err, account) => {
        if(err) throw err;
        next(req, res);
      });
    });
  });
};

/**
 * Adds a user (by ID) as one of another user's buddies.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The function to be executed when exiting the method.
*/
addBuddy = (req, res, next) => {
  Account.findOne({username: req.headers["username"]}, (err, account) => {
    if(!account) {
      return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
    }
    Account.findById(req.query.id).exec((err, otherAccount) => {
      if(!otherAccount) {
        return res.status(404).json({success: false, statusCode: 404, message: messages.idNotFound.replace("%1", req.query.id)});
      }
      if(otherAccount._id === account._id) {
        return res.status(400).json({success: false, statusCode: 400, message: "You cannot add yourself as a buddy."});
      }
      globalSettings.retrieveString("officialAccountId", res, function(key, res, officialAccountId) {
        if(otherAccount._id === officialAccountId) {
          return res.status(400).json({success: false, statusCode: 400, message: "You cannot add the official Acadiverse account as a buddy."});
        }
      });
      Account.updateOne({username: req.headers["username"]}, { $push: {buddies: req.query.id} }, (err, account) => {
        if(err) throw err;
        next(req, res);
      });
    });
  });
};

/**
 * Removes a user ID from another user's listr of buddies.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The function to be executed when exiting the method.
 */
removeBuddy = (req, res, next) => {
  Account.findOne({username: req.headers["username"]}, (err, account) => {
    if(!account) {
      return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
    }
    Account.findById(req.query.id).exec((err, otherAccount) => {
      if(!otherAccount) {
        return res.status(404).json({success: false, statusCode: 404, message: messages.idNotFound.replace("%1", req.query.id)});
      }
      Account.updateOne({username: req.headers["username"]}, { $pull: {buddies: req.query.id} }, (err, account) => {
        if(err) throw err;
        next(req, res);
      });
    });
  });
};

/**
 * Changes flags that represent what a user is allowed or not allowed to do.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The function to be executed when exiting the method.
 */
changePrivileges = (req, res, next) => {
  this.checkForWarning(req, res, function(req, res) {
    Account.findOne({username: req.query.username}, (err, account) => {
      if(!account) {
        return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.query.username)});
      }
        var accountQuery = ( { username: req.query.username } );
        var newData = { 
          $set: {
            canChat: req.body.canChat,
            canComment: req.body.canComment,
            canPublish: req.body.canPublish
          }
        };

        Account.updateOne(accountQuery, newData, function(err, res) {
          if(err) throw err;
          
          next(req, res);
        });
    });
  })
}

/**
 * Issues a strike to a user, restricting them if the type of strike is at least 3.
 * @param {string} username - The username of the user to give a strike to.
 * @param {string} type - The type of strike, usually a string representing the feature that the user was abusing.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The function to be executed when exiting the method.
 */
issueStrike = (username, type, req, res, next) => {
  accountQuery = { username: username };
    var strikes = 0;
    var newData = {};
    Account.findOne( { username: username } ).exec((err, account) => {
      if(!account) {
        return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", username)});
      }
      if(type === "publishing") {
        strikes = account.publishing_strikes + 1;
         if(strikes >= 3) {
          newData = { 
            $set: { 
              publishing_strikes: strikes, 
              can_publish: false 
            } 
          };
          authJwt.addToInfractionHistory(
            "Acadiverse", 
            account._id, 
            "Publishing Ban", 
            "Automatically banned from publishing due to getting 3 or more publishing strikes.", 
            req, res, 
            function(req, res) {

          });
        } else {
          newData = { 
            $set: { 
              publishing_strikes: strikes 
            } 
          };
        }
      }
    });
    Account.updateOne(accountQuery, newData, function(err, res) {
        if(err) throw err;
        next(req, res);
    });
}

/**
 * Checks if a user is banned from doing something on Acadiverse.
 * @param {string} feature - A string representing the feature that a user may be banned from using.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The function to be executed when exiting the method.
 */
isRestricted = (feature, req, res, next) => {
    Account.findOne({username: req.headers["username"]}).exec((err, account) => {
      if(!account) {
        return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
      } else {
        if(feature === "publishing") {
          next(!account.can_publish, req, res);
        }
        else if(feature === "wiki") {
          next(!account.can_edit_wiki, req, res);
        }
        else if(feature === "forum") {
          next(!account.can_use_forum, req, res);
        }        
      }
    });
}

/**
 * Gives a the specified user an achievement.
 * @param {string} achievement - A string representing the achievement.
 * @param {object} id - The ID of the user to give an achievement to.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The function to be executed when exiting the method.
 */
giveAchievement = (achievement, id, req, res, next) => {
  Account.findById(id).then(account => {
    if(!account) {
      if(res !== null) {
        return res.status(404).json({success: false, statusCode: 404, message: messages.idNotFound});
      } else {
        return;
      }
    }
  });
  var accountQuery = {_id: id};
  var newData = {};
  Account.findById(id).then(account => {
    switch(achievement) {
      case "MemberAnniversary":
        newData = { 
          $set: {
            achievement_member_anniversary: account.achievement_member_anniversary + 1
          }
        };
        break;
      case "TopPublisher":
        newData = {
          $set: {
            achievement_top_publisher: account.achievement_top_publisher + 1
          }
        };
        break;
      case "AcedIt":
        newData = {
          $set: {
            achievement_aced_it: account.achievement_aced_it + 1
          }
        };
        break;      
      default:
        return res.status(400).json({success: false, statusCode: 400, message: messages.invalidAchievement});
    }
    Account.updateOne(accountQuery, newData, function(err, res) {
      if(err) throw err;
      if(req === null || res === null) {
        return;
      }
      notifyUser(username, "AchievementRecieved", "", achievement, "", "", function(user) {
        next(req, res);
      });
    });
  }); 
}

/**
 * Adds or subtracts from a user's Reputation Points (points that affect what features are available to a user).
 * @param {Number} amount - The number of Reputation Points to give.
 * @param {object} id - The ID of the user to give Reputation Points to.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The function to be executed when exiting the method.
 */
changeReputationPoints = (amount, id, req, res, next) => {
  Account.findOne({_id: id}).then(account => {
    if(!account) {
      if(res !== null) {
        return res.status(404).json({success: false, statusCode: 404, message: messages.idNotFound});
      } else {
        return;
      }
    }
    var accountQuery = { _id: id };
    var newData = { 
      $set: {
        reputation_points: account.reputation_points + amount
      } 
    };
    Account.updateOne(accountQuery, newData, function(err, res) {
        if(err) throw err;
        if(req === null || res === null) {
          return;
        }
        next(req, res);
    });
  });
}

/**
 * Checks if a user has the specified amount of Reputation Points, usually requirements for using certain features.
 * @param {Number} requiredAmount - The amount of Reputation Points "required".
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The function to be executed if the user has the correct amount of Reputation Points.
 */
checkReputationPoints = (requiredAmount, req, res, next) => {
  Account.findOne({username: req.headers["username"]}).then(account => {
    if(!account) {
      return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
    }
    if(account.reputation_points < requiredAmount) {
      return res.status(400).json({success: false, statusCode: 400, message: messages.insufficientReputationPoints.replace("%1", requiredAmount).replace("%2", account.reputation_points)});
    } else {
      next(req, res);
    }
  });
}

/**
 * Gives a user a warning and bans them if they have too many.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The function to be executed when exiting the method.
 */
warnUser = (req, res, next) => {
  checkForWarning(req, res, function(req1, res1) {
    var accountQuery = { username: req1.query.username};   
      var numWarnings = 0;
      Account.findOne({username: req1.query.username}).then(account => {
        if(!account) {
          return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.query.username)});
        }
        numWarnings = account.warnings;
        reputationPoints = account.reputation_points;
        var newData = { 
          $set: {
            reputation_points: reputationPoints + globals.REP_LOSS_WARNING,
            warnings: numWarnings + 1, 
            acknowledged_last_warning: false, 
            date_last_warning_received: new Date(), 
            last_warned_by_moderator_name: req.headers["username"], 
            last_warning_reason: req.body.warningReason,
          } 
        };
        Account.updateOne(accountQuery, newData, function(err, res2) {
          if(err) throw err;
          authJwt.addToInfractionHistory(
            req1.query.username, 
            account._id, 
            "Warning", 
            req1.query.warningReason, 
            req1, res2, 
            function(req1, res3) {
            numWarnings += 1;

            //This code checks if the user has recieved 3 or more warnings and automatically bans them if they have.
            if(numWarnings >= 3) { //If the user has recieved 3 or more warnings...
              var numberString = numWarnings.toString(); //Convert the number of warnings to a string.
              var lastDigit = numberString.charAt(numberString.length - 1); //Get the character representing the last digit in the number.

              //This code makes the warning number into an ordinal.
              if(lastDigit === '1')
              {
                numberString = numberString + "st";
              }
              else if(lastDigit === '2')
              {
                numberString = numberString + "nd";
              }
              else if(lastDigit === '3')
              {
                numberString = numberString + "rd";
              }
              else
              {
                numberString = numberString + "th";
              }

              var automaticBanReason = messages.automaticBanReason.replace("%1", numberString); //This is the reason for the automatic ban when receiving a warning.
              var dateBanExpires = new Date(); //Set the expiration date for the automatic ban to the current date.
              if(numWarnings == 3) {
                dateBanExpires = dateBanExpires.setTime(dateBanExpires.getTime() + 12 * 60 * 60 * 1000); //Set the ban to last for 12 hours.
              }
              else if(numWarnings == 4) {
                dateBanExpires = dateBanExpires.setTime(dateBanExpires.getTime() + 24 * 60 * 60 * 1000); //Set the ban to last for 24 hours.
              }
              else if(numWarnings == 5) {
                dateBanExpires = dateBanExpires.setTime(dateBanExpires.getTime() + 72 * 60 * 60 * 1000); //Set the ban to last for 72 hours.
              }
              else if(numWarnings == 6) {
                dateBanExpires = dateBanExpires.setDate(dateBanExpires.getDate() + 14); //Set the ban to last for 14 days.
              }
              else if(numWarnings == 7) {
                dateBanExpires = dateBanExpires.setDate(dateBanExpires.getDate() + 30); //Set the ban to last for 30 days.
              }
              else if(numWarnings == 8) {
                dateBanExpires = dateBanExpires.setMonth(dateBanExpires.getMonth() + 6); //Set the ban to last for 6 months.
              }
              else if(numWarnings == 9) {
                dateBanExpires = dateBanExpires.setFullYear(dateBanExpires.getFullYear() + 1); //Set the ban to last for 1 year.
              }
              else if(numWarnings >= 10) {
                dateBanExpires = new Date(1970, 1, 1); //Set the date to 1970 to give the user a permanent ban.
              }

              authJwt.banAccount(
                "Acadiverse", 
                automaticBanReason, 
                dateBanExpires, 
                req1, res2, 
                function(req2, res3) { //Automatically ban the user and use the official Acadiverse account for adding to the user's infraction history.

              });
            }
          });
        });
      })
      next(req, res1);
  });
  
}

/**
 * Clears out any active warning a user has while keeping the total number of warnings.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The function to be executed when exiting the method.
 */
acknowledgeWarning = (req, res, next) => {
  var accountQuery = { username: req.headers["username"]};   
  Account.findOne({username: req.headers["username"]}).then(account => {
    if(!account) {
      return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.query.otherUsername)});
    }
    var newData = { 
      $set: {
        acknowledged_last_warning: true, 
        date_last_warning_recieved: new Date("1970-01-01"), 
        last_warned_by_moderator_name: "", 
        last_warning_reason: ""
      } 
    };
    Account.updateOne(accountQuery, newData, function(err, res) {
      if(err) throw err;
    });
    next(req, res);
  })
}

/**
 * Checks if a user has an active warning, prohibiting them from continuing if this is true.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The function to be executed if the user does not have an active warning.
 */
checkForWarning = (req, res, next) => {
  Account.findOne({username: req.headers["username"]}).then(account => {
    if(!account) {
      return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", username)});
    } else {
      if(!account.acknowledged_last_warning) {
        return res.status(400).json({success: false, statusCode: 400, message: messages.activeWarning});
      }
      next(req, res);
    }
  });
}

/**
 * Sends a report to all moderators.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The function to be executed when exiting the method.
 */
report = (req, res, next) => {
  console.log(req);
  Account.findOne({username: req.headers["username"]}, function(err, account) {
    if(!account) {
      return res.status(404).json({success: false, statueCode: 404, message: messages.invalidUsername});
    }
    if(!account.acknowledged_last_warning) {
      return res.status(400).json({success: false, statusCode: 400, message: messages.activeWarning});
    }
  });
    if(req.body.context === "user") {
      console.log("Report context: user");
      console.log(res);
      if(req.body.content === "acadiverse") {
        return res.status(400).json({success: false, statusCode: 400, message: "You cannot report the official Acadiverse account. If this account is breaking the rules (highly unlikely), then send a bug report instead."});
      }
      if(req.body.content === "admin") {
        return res.status(400).json({success: false, statusCode: 400, message: "You cannot report the admin account."});
      }
      if(req.body.content === req.headers["username"]) {
        return res.status(400).json({success: false, statusCode: 400, message: "You cannot report yourself."});
      }
    }
    Account.find({roles: "moderators"}, (err, accounts) => {
      accounts.forEach(account => {
        sendPMAsAcadiverse(account._id, 
            messages.reportPM.replace("%1", req.body.username)
                            .replace("%2", req.body.content)
                            .replace("%3", req.body.context)
                            .replace("%4", req.body.contentURL)
                            .replace("%5", req.body.reason)
                            .replace("56", req.body.details),
                            function(message) {
                              console.log(`${new Date()}: Sent report PM to ${account.username}.`)
                            });
        globalSettings.retrieveString("officialAccountId", null, function(officialAccountId) {
          this.sendPM(
            officialAccountId,
          );
        });
      });
    });
    next(req, res);
}

/**
 * Completes the onboarding process for a user.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The function to be executed when exiting the method.
 */
completeOnboarding = (req, res, next) => {
  checkForWarning(req, res, function(req, res) {
    var gradeLevel = req.body.gradeLevel;
    var accountType = req.body.accountType;

    var query = { username: req.headers["username"]};
    var newData = { 
      $set: {
        
      }
    };
    Account.updateOne((err, account) => {
      if (err) throw err;
      next(req, res);
    });
  });
}

const accountModule = {
    restoreAdminAccount,
    restoreOfficialAcadiverseAccount,
    sendPMAsAcadiverse,
    sendPM,
    updateData,
    editProfile,
    changeSettings,
    changeAvatar,
    checkBlockedUsers,
    notifyUser,
    blockUser,
    unblockUser,
    addBuddy,
    removeBuddy,
    changePrivileges,
    issueStrike,
    isRestricted,
    giveAchievement,
    changeReputationPoints,
    checkReputationPoints,
    warnUser,
    acknowledgeWarning,
    checkForWarning,
    report
};

module.exports = accountModule;