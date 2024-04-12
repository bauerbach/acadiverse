/**
 * @file Methods for social features such as comments and Classroom Discussions.
 * @author Bradley Auerbach <bauerbach@gmail.com>
 * @version 1.0.0
 */

const db = require('../models');
const mongoose = require('mongoose');
const chatFilter = require('../config/chatFilter');
const Account = require('../models/account.model');
const BlogPost = require('../models/blog-post.model');
const ClassroomDiscussion = require('../models/classroom-discussion.model');
const Comment = require('../models/comment.model');
const Submission = require('../models/submission.model');
const ForumCategory = require('../models/forum-category.model');
const ForumPost = require('../models/forum-post.model');
const messages = require('../config/messages');
const authJwt = require('./authJWT');
const accountModule = require('./account');
const globals = require('../config/globals');
const { account } = require('../models');
const globalSettings = require('./global-settings');

/**
 * Filters out any offensive language from the specified text.
 */
filter = (mode, filterLevel, text, next) => {
    var filterLevelValue = 0;
    switch(filterLevel) {
        case "LOW":
            filterLevelValur = 1;
            break;
        case "MODERATE":
            filterLevelValue = 2;
            break;
        case "STRICT":
            filterLevelValue = 3;
            break;
        default:
            return;
    }
    var regexString = '';
    var censoredText = "";
    for(var entry in chatFilter.blockedWords) {
        regexString = regexString + "\\b" + entry.word;
    }

    var containsBlockedWords = new RegExp(regexString);
    if(mode === "BLOCK") {
        if(containsBlockedWords.test(text)) {
            next(text, true); //"true" here means that the text was blocked.
        }
    }
    else if(mode === "CENSOR") {
        for(var entry in chatFilter.blockedWords) {
            if(filterLevelValue === 4) {
                next(text, true); //"true" here means that the text was blocked.
                return;
            } else {
                if(filterLevelValue === entry.filterLevel) {
                    censoredText = text.replace(regexString, '-');
                }
            }
        }
    }
    else if(mode === "CLEAN") {
        for(var entry in chatFilter.blockedWords) {
            if(filterLevelValue === 4) {
                next(text, true); //"true" here means that the text was blocked.
                return;
            } else {
                if(filterLevelValue === entry.filterLevel) {
                    regexString = regexString + "\\b" + entry.word;
                    censoredText = text.replace(regexString, entry.substitution);
                }
            }
        }
        next(censoredText, false); //"false" here means that the text was censored or cleaned rather than blocked.
    }
}

/**
 * Adds a comment to content depending on the context.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
addComment = (context, req, res, next) => {
    authJwt.checkForBan(req.query.commenter, req, res, function(req, res) {
        accountModule.checkForWarning(req, res, function(req, res) {
            if(context === "Submission") {
                Submission.findById(req.query.submissionId, (err, submission) => {
                    var filterLevel = "";
                    if(submission.mature_content) {
                        filterLevel = "LOW";
                    } else {
                        if(submission.min_grade >= 7) { //Max. Grade is ignored because it should never be lower than Min. Grade.
                            filterLevel = "MODERATE";
                        } else {
                            filterLevel = "STRICT";
                        }
                    }
                    filter("CENSOR", req.body.text, function(censoredext, blocked) {
                        submission.comments.push(new Comment({
                            commenter: req.query.commenter,
                            date: new Date(),
                            context: "SUBMISSION",
                            text: censoredText
                        }))
                    });
                });
            }
            else if(context === "BlogPost") {
                BlogPost.findById(req.query.submissionId, (err, submission) => {
                    
                });
            }
        });    
    });
}

/**
 * Deletes a comment from content.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
deleteComment = (context, req, res, next) => {
    authJwt.checkForBan(req, res, function(req, res) {
        accountModule.checkForWarning(req, res, function(req, res) {
            if(context === "Submission") {
            Submission.findById(req.query.submissionId, (err, submission) => {
                submission.comments.pull(req.query.id);
                submission.save();
            });
            }
            else if(context === "BlogPost") {
                BlogPost.findById(req.query.submissionId, (err, post) => {
                    post.comments.pull(req.query.id);
                    post.save();
                });
            }
        });
        
    });
}

/**
 * Submits the provided post to the Acadiverse Blog.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
postToBlog = (req, res, next) => {
    var author = "";
    var authorUsername = "";
    Account.findOne({username: req.headers["username"]}, (err, account) => {
        if(!account) {
            return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
        } else {
            author = account._id;
            authorUsername = account.username;
        }
    });
    accountModule.checkForWarning(req, res, function(req1, res1) {
        authJwt.userHasRole(authorUsername, "admins", function(userIsAdmin) {
            authJwt.userHasRole(authorUsername, "moderators", function(userIsModerator) {
                authJwt.userHasRole(authorUsername, "developers", function(userIsDeveloper) {
                    if(userIsAdmin || userIsModerator || userIsDeveloper) {
                        BlogPost.create({
                            name: req.body.name,
                            author: author,
                            date_created: new Date(),
                            post_contents: req.body.postContents
                        }, function(err, post) {
                            if(err) throw err;
                            next(req1, res);
                        });
                    } else {
                        return res.status(401).json({success: false, statusCode: 401, message: "You must be an Acadiverse admin, moderator, or developer to perform this action."});
                    }
                });
            });
        });
    });
}

/**
 * Makes the specified edits to an Acadiverse Blog ppst.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
editBlogPost = (req, res, next) => {
    var author = "";
    Account.findOne({username: req.headers["username"]}, (err, account) => {
        if(!account) {
            return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
        } else {
            author = account._id;
        }
    });
    accountModule.checkForWarning(req, res, function(req, res) {
        authJwt.userHasRole(author, "admins", function(userIsAdmin) {
            authJwt.userHasRole(author, "moderators", function(userIsModerator) {
                authJwt.userHasRole(author, "developers", function(userIsDeveloper) {
                    if(userIsAdmin || userIsModerator || userIsDeveloper) {
                        var postQuery = { _id: req.query.id }
                        var newData = { $set: {name: req.query.name, post_contents: req.body.postContents}}
                        BlogPost.updateOne(postQuery, newData, function(err, res) {
                            if(err) throw err;
                            next(req, res);
                        });
                    } else {
                        return res.status(401).json({success: false, statusCode: 401, message: "You must be an Acadiverse admin, moderator, or developer to perform this action."});
                    }
                });
            });
        });
    });
}

/**
 * Creates a new Classroom Discussion.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
createClassroomDiscussion = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        Account.findOne({username: req.headers["username"]}, (err, account) => {
            if(!account) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
            }
        });
    });
}

/**
 * Deletes a Classroom Discussion.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
deleteClassroomDiscussion = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        Account.findOne({username: req.headers["username"]}, (err, account) => {
            if(!account) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
            }
            ClassroomDiscussion.findById(req.query.id).exec((err, classroomDiscussion) => {
                if(!classroomDiscussion) {
                    return res.status(404).json({success: false, statusCode: 404, message: messages.classroomDiscussionNotFound});
                }
                if(classroomDiscussion.teacher === account._id) {
                    ClassroomDiscussion.deleteOne({_id: classroomDiscussion._id}).then(function() {
                        next(req, res);
                    });
                } else {
                    return res.status(403).json({success: false, statusCode: 403, message: messages.notClassroomDiscussionOwner});
                }
            });
        });
    });
}

/**
 * Changes the owner of a Classroom Discussion.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
changeClassroomDiscussionTeacher = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        Account.findOne({username: req.headers["username"]}, (err, account) => {
            if(!account) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
            }
            ClassroomDiscussion.findById(req.query.id).exec((err, classroomDiscussion) => {
                if(!classroomDiscussion) {
                    return res.status(404).json({success: false, statusCode: 404, message: messages.classroomDiscussionNotFound});
                }
                if(classroomDiscussion.teacher === account._id) {
                    ClassroomDiscussion.updateOne({_id: classroomDiscussion._id}, {teacher: req.query.teacher}, function(err, res) {
                        if(err) throw err;
                        next(req, res);
                    });
                } else {
                    return res.status(403).json({success: false, statusCode: 403, message: messages.notClassroomDiscussionOwner});
                }
            });
        });
    });
}



/**
 * Renames a Classroom Discussion.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
renameClassroomDiscussion = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        Account.findOne({username: req.headers["username"]}, (err, account) => {
            if(!account) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
            }
            ClassroomDiscussion.findById(req.query.id).exec((err, classroomDiscussion) => {
                if(!classroomDiscussion) {
                    return res.status(404).json({success: false, statusCode: 404, message: messages.classroomDiscussionNotFound});
                }
                if(classroomDiscussion.teacher === account._id) {
                    ClassroomDiscussion.updateOne(
                        {_id: classroomDiscussion._id}, 
                        {name: req.query.name}, 
                        function(err, res) {
                            if(err) throw err;
                            next(req, res);
                    });
                } else {
                    return res.status(403).json({success: false, statusCode: 403, message: messages.notClassroomDiscussionOwner});
                }
            });
        });
    });
}

/**
 * Adds an assignment to a Classroom Discussion.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
addAssignemnt = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        Account.findOne({username: req.headers["username"]}, (err, account) => {
            if(!account) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
            }
            ClassroomDiscussion.findById(req.query.id).exec((err, classroomDiscussion) => {
                if(!classroomDiscussion) {
                    return res.status(404).json({success: false, statusCode: 404, message: messages.classroomDiscussionNotFound});
                }
                if(classroomDiscussion.teacher === account._id) {
                    ClassroomDiscussion.updateOne(
                        {
                            $push: {
                                assignments: {
                                    assignment_id: req.query.assignmentId,
                                    accepted: [],
                                    completed: []
                                }
                            }
                        }, 
                        {name: req.query.name}, 
                        function(err, res) {
                            if(err) throw err;
                            next(req, res);
                    });
                } else {
                    return res.status(403).json({success: false, statusCode: 403, message: messages.notClassroomDiscussionOwner});
                }
            });
        });
    });
}

/**
 * Removes an assignment from a Classroom Discussion.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
removeAssignemnt = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        Account.findOne({username: req.headers["username"]}, (err, account) => {
            if(!account) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
            }
            ClassroomDiscussion.findById(req.query.id).exec((err, classroomDiscussion) => {
                if(!classroomDiscussion) {
                    return res.status(404).json({success: false, statusCode: 404, message: messages.classroomDiscussionNotFound});
                }
                if(classroomDiscussion.teacher === account._id) {
                    ClassroomDiscussion.updateOne(
                        {
                            $pull: {
                                assignments: {assignment_id: req.query.assignmentId}
                            }
                        },
                        {name: req.query.name}, 
                        function(err, res) {
                            if(err) throw err;
                            next(req, res);
                    });
                } else {
                    return res.status(403).json({success: false, statusCode: 403, message: messages.notClassroomDiscussionOwner});
                }
            });
        });
    });
}

/**
 * Marks a Classroom Discussion assignment as "accepted" by the specified user.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
acceptAssignment = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        Account.findOne({username: req.headers["username"]}, (err, account) => {
            if(!account) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
            }
        });
    });
}

/**
 * Marks a Classroom Discussion assignment as "completed" by the specified user.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method..
 */
completeAssignment = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        Account.findOne({username: req.headers["username"]}, (err, account) => {
            if(!account) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
            }
        });
    });
}
/**
 * Creates a new Acadiverse Forum category.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
createForumCategory = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        authJwt.isAdmin(req, res, function(req, res) {
            Account.findOne({username: req.headers["username"]}, (err, account) => {
                if(!account) {
                    return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
                }
            });
        });
    });
}

/**
 * Deletes an Acadiverse Forum category.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
deleteForumCategory = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        authJwt.isAdmin(req, res, function(req, res) {
            Account.findOne({username: req.headers["username"]}, (err, account) => {
                if(!account) {
                    return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
                }
                ForumCategory.findById(req.query.id).exec((err, category) => {
                    if(!category) {
                        return res.status(404).json({success: false, statusCode: 404, message: messages.classroomDiscussionNotFound});
                    }
                    ForumCategory.deleteOne({_id: category._id}).then(function() {
                        next(req, res);
                    });
                });
            });
        });
        
    });
}

/**
 * Edits an Acadiverse Forum category.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
editForumCategory = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        authJwt.isAdmin(req, res, function(req, res) {
            Account.findOne({username: req.headers["username"]}, (err, account) => {
                if(!account) {
                    return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
                }
                ForumCategory.findById(req.query.id).exec((err, category) => {
                    if(!category) {
                        return res.status(404).json({success: false, statusCode: 404, message: messages.classroomDiscussionNotFound});
                    }
                    ForumCategory.updateOne({_id: category._id}, function(err, res) {
                        if(err) throw err;
                        next(req, res);
                    });
                });
            });
        });
    });
}

/**
 * Creates a new Acadiverse Forum or Classroom Discussion post.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
postToForum = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        Account.findOne({username: req.headers["username"]}, (err, account) => {
            if(!account) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
            }
            if(!req.query.classroomDiscussion) {
                accountModule.isRestricted("forum", req, res, function(req, res) {
                    ForumCategory.findById(req.query.category).then((err, category) => {
                        if(!category) {
                            return res.status(404).json({success: false, statusCode: 404, message: messages.categoryNotFound});
                        } else {
                            ForumPost.create({
                                name: req.body.name,
                                author: account._id,
                                category: req.query.category,
                                date_created: new Date(),
                                post_contents: req.body.postContents
                            }, (err, post) => {
                                if(err) throw err;
                                next(req, res);
                            })
                        }
                    });
                });
            } else {
                ClassroomDiscussion.findById(req.query.classroomDiscussion).then((err, classroomDiscussion) => {
                    if(!classroomDiscussion) {
                        return res.status(404).json({success: false, statusCode: 404, message: messages.classroomDiscussionNotFound});
                    } else {
                        ForumPost.create({
                            name: req.body.name,
                            author: account._id,
                            category: req.query.classroomDiscussion,
                            is_classroom_discussion_post: true,
                            date_created: new Date(),
                            post_contents: req.body.postContents
                        }, (err, post) => {
                            if(err) throw err;
                            next(req, res);
                        })
                    }
                });
            }
        });
    });
}

/**
 * Edits an Acadiverse Forum or Classroom Discussion post.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
editForumPost = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        Account.findOne({username: req.headers["username"]}, (err, account) => {
            if(!account) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
            } else {
                accountModule.isRestricted("forum", req, res, function(req, res) {
                    ForumPost.findById(req.query.id).then((err, post) => {
                        if(!post) {
                            return res.status(404).json({success: false, statusCode: 404, message: messages.postNotFound});
                        }
                    });
                });
            }
        });
    });
}

/**
 * Submits a reply to an Acadiverse Forum or Classroom Discussion post.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
replyToForumPost = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        Account.findOne({username: req.headers["username"]}, (err, account) => {
            if(!account) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
            }
        });
    });
}

/**
 * Deletes an Acadiverse Forum or Classroom Discussion post.
 * @param {object} req - The request passed to the function.
 * @param {object} res - The response given by the server.
 * @param {function} next - The funtion to be executed when exiting the method.
 */
deleteForumPost = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        Account.findOne({username: req.headers["username"]}, (err, account) => {
            if(!account) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
            }
        });
    });
}

const socialFeatures = {
    filter,
    addComment,
    deleteComment,
    postToBlog,
    editBlogPost,
    createClassroomDiscussion,
    deleteClassroomDiscussion,
    changeClassroomDiscussionTeacher,
    renameClassroomDiscussion,
    addAssignemnt,
    removeAssignemnt,
    acceptAssignment,
    completeAssignment,
    postToForum,
    editForumPost,
    replyToForumPost,
    deleteForumPost
}

module.exports = socialFeatures;