/**
 * @file Methods for submissions and store items.
 * @author Bradley Auerbach <bauerbach@gmail.com>
 * @version 1.0.0
 */

const db = require('../models');
const mongoose = require('mongoose');
const chatFilter = require('../config/chatFilter');
const Account = require('../models/account.model');
const Comment = require('../models/comment.model');
const Submission = require('../models/submission.model');
const accountModule = require('../middlewares/account');
const messages = require('../config/messages');
const verification = require('./verification');
const authJwt = require('./authJWT');
const globals = require('../config/globals');
const builtInItems = require('../config/built-in-items');
const formidable = require("formidable");
const { account } = require('../models');

publish = (req, res, next) => {
    account.findOne({username: req.headers["username"]}, (err, account) => {
        if(!account) {
            return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
        }
        accountModule.isRestricted("publishing", req, res, function(bannedFromPublishing, req, res) {
            accountModule.checkForWarning(req, res, function(req, res) {
                accountModule.checkReputationPoints(globals.REP_PUBLISHING, req, res, function(req, res) {
                    if(bannedFromPublishing) {
                        return res.status(403).json({success: false, statusCode: 403, message: messages.bannedFromPublishing});
                    } else {
                        var title = req.body.title
                        var description = req.body.description;
                        var tags = req.body.tags;
                        var author = account._id;
                        var submissionType = req.body.submissionType;
                        var category = req.body.category;
                        var minGrade = req.body.minGrade;
                        var maxGrade = req.body.maxGrade;
                        var matureContent = req.body.matureContent;
                        var topic = req.body.topic;
                        var creationDate = new Date();

                        if (!req.body.file) {
                            return res.status(400).send({success: false, statusCode: 400, message: "You must upload a file."});
                        }
                        
                        const filename = req.body.file.filename;
                        const destination = req.body.file.destination;
                        const filePath = `${destination}/${filename}`;
                        
                          fs.rename(req.file.path, filePath, (error) => {
                            if (error) {
                              return res.status(500).send({success: false, statusCode: 500, message: "An unknown error occurred while saving the file."});
                            }

                        });
                        console.log(form);
                        Submission.create({
                            title: title,
                            description: description,
                            tags: tags,
                            file: filePath,
                            author: author,
                            submission_type: submissionType,
                            date_created: creationDate,
                            last_updated: creationDate,
                            category: category,
                            min_grade: minGrade,
                            max_grade: maxGrade,
                            mature_content: matureContent,
                            topic: topic
                        }, function(err) {
                            if(err) return err.message;
                            next(req, res);
                        });
                    }
                });       
            });
        });
    });
    
}

isStoreItem = (id, next) => {
    Submission.findOne({_id: id}, (error, submission) => {
        if(!submission) {
            return;
        }
        var result = (submission.category === "Store Items");
        next(id, result);
    });
}

updateSubmission = (req, res, next) => {
    accountModule.isRestricted("publishing", req, res, function(bannedFromPublishing, req, res) {
        accountModule.checkForWarning(req, res, function(req, res) {
            accountModule.checkReputationPoints(globals.REP_PUBLISHING, req, res, function(req, res) {
                if(bannedFromPublishing) {
                    return res.status(403).json({success: false, statusCode: 403, message: messages.bannedFromPublishing});
                } else {
                    Submission.findById(req.query.id).exec((err, submission => {
                        if(!submission) {
                            return res.status(404).json({success: false, statusCode: 404, message: messages.submissionNotFound});
                        }
                        if(req.query.accountId !== submission.author) {
                            return res.status(403).json({success: false, statusCode: 403, message: messages.notSubmissionAuthor});
                        }
                        var title = req.body.title
                        var description = req.body.description;
                        var tags = req.body.tags
                        var submissionType = req.body.submissionType;
                        var lastUpdated = new Date();
                        var submissionQuery = {id: _id};
                        var newData = { $set: { title: title, description: description, tags: tags, submission_type: submissionType, last_updated: lastUpdated }};
                        Submission.updateOne(submissionQuery, newData, function(err, res) {
                            if (err) throw err;
                            next(req, res);
                        });
                    }))                       
                }
            });
            
        });
    });
}

upvoteSubmission = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        Submission.findById(req.query.id).exec((err, submission) => {
            if(!submission) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.submissionNotFound});
            } else {
                var newUpvotes = submission.upvotes + 1;
                submission.updateOne({_id: req.query.id}, {$set: {upvotes: newUpvotes}}, function(err, res) {
                    if(err) throw err;
                    if(submission.upvotes === 10 || submission.upvotes % 100 === 0) {
                        Account.findById(submission.author).exec((err, account) => {
                            if(!account) {
                                next(req, res);
                                return;
                            } else {
                                accountModule.notifyUser(account.username, "SubmissionUpvote", submission.name, globals.DOMAIN + "/submissions/view?id=" + submission._id, submission.upvotes, function(author) {
                                    next(req, res);
                                });
                            }
                        });
                    }
                });
            }
        });
    });
}

downvoteSubmission = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        Submission.findById(req.query.id).exec((err, submission) => {
            if(!submission) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.submissionNotFound});
            } else {
                var newUpvotes = submission.downvotes + 1;
                submission.updateOne({_id: req.query.id}, {$set: {upvotes: newDownvotes}}, function(err, res) {
                    if(err) throw err;
                    next(req, res);
                });
            }
        });
    });
}

favoriteSubmission = (req, res, next) => { 
    accountModule.checkForWarning(req, res, function(req, res) {
        Submission.findById(req.query.id).exec((err, submission) => {
            if(!submission) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.submissionNotFound});
            } else {
                var newFavorites = submission.favorites + 1;
                submission.updateOne({_id: req.query.id}, {$set: {favorites: newFavorites}}, function(err, res) {
                    if(err) throw err;
                    next(req, res);
                });
            }
        });
    });
}

unfavoriteSubmission = (req, res, next) => { 
    accountModule.checkForWarning(req, res, function(req, res) {
        Submission.findById(req.query.id).exec((err, submission) => {
            if(!submission) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.submissionNotFound});
            } else {
                var newFavorites = submission.favorites - 1;
                submission.updateOne({_id: req.query.id}, {$set: {favorites: newFavorites}}, function(err, res) {
                    if(err) throw err;
                    next(req, res);
                });
            }
        });
    });
}

rateDifficulty = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        Submission.findById(req.query.id).exec((err, submission) => {
            if(!submission) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.submissionNotFound});
            } else {
                var userID = null;
                var numberOfRatings = 0;
                var ratingAmount = 0;
                var averageRating = 0.0;
                Account.findOne({username: req.headers["username"]}, (err, account) => {
                    if(!account) {
                        return res.status(404).json({success: false, statusCode: 404, message: messages.invaludUsername });
                    } else {
                        userID = account._id;
                    }
                });
                submission._difficulty_ratings.push({ key: userID, value: req.query.rating });
                submission.save();
                submission._difficulty_ratings.forEach((rating) => {
                    numberOfRatings++;
                    ratingAmount += rating.value;
                });

                if(numberOfRatings >= 0) {
                    averageRating = ratingAmount / numberOfRatings;
                }

                Submission.updateOne({_id: req.query.id}, { $set: {difficulty: averageRating}}, (err, submission) => {
                    if (err) return err;
                    next(req, res);
                })
            }
        });
    }); 
}

rateFunness = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        Submission.findById(req.query.id).exec((err, submission) => {
            if(!submission) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.submissionNotFound});
            } else {
                var userID = null;
                var numberOfRatings = 0;
                var ratingAmount = 0;
                var averageRating = 0.0;
                Account.findOne({username: req.headers["username"]}, (err, account) => {
                    if(!account) {
                        return res.status(404).json({success: false, statusCode: 404, message: messages.invaludUsername });
                    } else {
                        userID = account._id;
                    }
                });
                submission._funness_ratings.push({ key: userID, value: req.query.rating });
                submission.save();
                submission._funness_ratings.forEach((rating) => {
                    numberOfRatings++;
                    ratingAmount += rating.value;
                });

                if(numberOfRatings >= 0) {
                    averageRating = ratingAmount / numberOfRatings;
                }

                Submission.updateOne({_id: req.query.id}, { $set: {funness: averageRating}}, (err, submission) => {
                    if (err) return err;
                    next(req, res);
                })
            }
        });
    }); 
}

hideSubmission = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        Submission.findById(req.query.id).exec((err, submission) => {
            if(!submission) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.submissionNotFound});
            } else {
                var submissionAuthor = submission.author;
                Submission.updateOne({_id: req.query.id}, {$set: {hidden: true}}).then(function() {
                    Account.findById(submissionAuthor).exec((err, account) => {
                        if(account) {
                            if(account.username !== req.headers["username"]) {
                                accountModule.addToInfrractionHistory(req.headers["username"], submissionAuthor, "Submission Hiding", req.query.reason, req, res, function(req, res) {
                                    accountModule.changeReputationPoints(globals.REP_LOSS_SUBMISSION_HIDDEN, submissionAuthor, req, res, function(req, res) {
                                        globalSettings.retrieveString("officialAccountId", res, function(key, res, officialAccountId) {
                                            accountModule.sendPM(
                                                officialAccountId, submissionAuthor, 
                                                messages.submissionHiddenPM.replace("%1", submission.name).replace("%2", globals.DOMAIN + "/submissions/view?id=" + submission._id).replace("%3", req.query.reason), res, function(req, res) {
                                                accountModule.issueStrike(account.username, "publishing", req, res, function(req, res) {
                                                    next(req, res);
                                                });
                                            });
                                        });
                                    });
                                });
                                
                            }
                        } else {
                            next(req, res);
                        }
                    });
                });
            }
        });
    });
}

unhideSubmission = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        Submission.findById(req.query.id).exec((err, submission) => {
            if(!submission) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.submissionNotFound});
            } else {
                Submission.updateOne({_id: req.query.id}, {
                    $set: {
                        hidden: false
                    }
                }).then(function() {
                    next(req, res);
                });
            }
        });
    });
}

deleteSubmission = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        Submission.findById(req.query.id).exec((err, submission) => {
            if(!submission) {
                return res.status(404).json({success: false, statusCode: 404, message: messages.submissionNotFound});
            } else {
                var submissionName = submission.name;
                var submissionAuthor = submission.author;
                var submissionCatewgory = submission.category;

                Submission.deleteOne({_id: req.query.id}).then(function() {
                    Account.findById(submissionAuthor).exec((err, account) => {
                        if(account) {
                            if(account.username !== req.headers["username"]) {
                                authJwt.checkRoleByUsername(req.headers["username"], "admins", function(userIsAdmin) {
                                    if(userIsAdmin) {
                                        accountModule.addToInfrractionHistory(req.headers["username"], submissionAuthor, "Submission Deletion", req.query.reason, req, res, function(req, res) {
                                            accountModule.changeReputationPoints(globals.REP_LOSS_SUBMISSION_DELETED, submissionAuthor, req, res, function(req, res) {
                                                globalSettings.retrieveString("officialAccountId", res, function(key, res, officialAccountId) {
                                                    accountModule.sendPM(officialAccountId, submissionAuthor, 
                                                        messages.submissionDeletedPM.replace("%1", submissionName), res, function(req, res) {
                                                        accountModule.issueStrike(account.username, "publishing", req, res, function(req, res) {
                                                            next(req, res);
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    } 
                                });
                            }
                        } else {
                            next(req, res);
                        }
                    });
                });
            }
        });
    });  
}

purchaseItem = (req, res, next) => {
    Submission.findById(req.query.id).exec((err, item) => {
        if(!item) {
            return res.status(404).json({success: false, statusCode: 404, message: messages.storeItemNotFound});
        } else {
            if(item.is_discontinued) {
                return res.status(400).json({success: false, statusCode: 400, message: messages.itemDiscontinued});
            } else {
                var currentDate = (globals.ENABLE_DEBUG_MODE && globals.FAKE_CURRENT_DATE) ? globals.FAKE_DATE : new Date();
                if(item.is_seasonal
                        && currentDate.getMonth() < item.season_start_month 
                        && currentDate.getMonth() > item.season_end_month
                        && currentDate.getDate() < item.season_start_day 
                        && currentDate.getDate() > item.season_end_day) {
                    return res.status(400).json({
                        success: false, 
                        statusCode: 400, 
                        message: messages.itemNotInSeason.replace("%1", globals.MONTHS[item.season_begin.getMonth()] + " " + item.season_begin.getDate()).replace("%2", globals.MONTHS[item.season_end.getMonth()] + " " + item.season_end.getDate())});
                } else {
                    if(item.is_exclusive) {
                        return res.status(400).json({success: false, statusCode: 400, message: messages.itemExclusive});
                    } else {
                        Account.findOne({username: req.headers["username"]}).exec((err, account) => {
                            if(account.money < item.price) {
                                return res.status(400).json({success: false, statusCode: 400, message: messages.insufficientMoney.replace("%1", Math.abs(account.money - item.price))});
                            } else {
                                if(req.query.id in account.owned_items) {
                                    return res.status(400).json({success: false, statusCode: 400, message: messages.userAlreadyHasItem});
                                } else {
                                    account.owned_items.push(req.query.id);
                                    account.save();
                                    var newBalance = account.money - item.price;
                                    Account.updateOne({username: username}, {$set: {money: newBalance}}, function(err, res) {
                                        if(err) throw err;
                                        next(req, res);
                                    });
                                }
                            }
                        });
                    }
                }
            }
        }
    });
}

discardItem = (req, res, next) => {
    accountModule.checkForWarning(req, res, function(req, res) {
        this.userHasItem(req, res, function(req, res) {
            Account.updateOne({username: req.headers["username"]}, {
                $pull: {
                    owned_items: req.query.id
                }
            }, function(err, res) {
                if(err) throw err;
                next(req, res);
            });
        });
    }); 
}

userHasItem = (req, res, next) => {
    Account.findOne({username: req.headers["username"]}).exec((err, account) => {
        if(!account) {
            return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.query.otherUsername)});
          }
        if(account.owned_items.includes(req.query.id)) {
            next(req, res);
        } else {
            return res.status(404).json({success: false, statusCode: 404, message: messages.itemNotOwned.replace("%1", req.query.id)});
        }
    })
}

refreshBuiltInItems = () => {
    Account.findOne({username: "acadiverse"}).exec((err, account) => {
        if(!account) {
            accountModule.restoreOfficialAcadiverseAccount();
        } else {
            let officialAccountId = account._id;
            if(account.banned_from_publishing || account.account_banned || !account.acknowledged_last_warning || account.reputation_points < globals.REP_PUBLISHING) {
                accountModule.restoreOfficialAcadiverseAccount();
            }

            builtInItems.storeItems.forEach((item) => {
                Submission.findOne({title: item.title, author: officialAccountId}).exec((err, submission) => {
                    if(!submission) {
                        Submission.create({
                            title: item.title,
                            description: item.description,
                            tags: item.tags,
                            author: officialAccountId,
                            submission_type: item.type,
                            category: item.category,
                            date_created: new Date(),
                            last_updated: new Date(),
                            is_exclusive: item.exclusive,
                            is_discontinued: item.discontinued,
                            is_seasonal: item.seasonal,
                            season_start_month: item.seasonStartMonth,
                            season_end_month: item.seasonEndMonth,
                            season_start_day: item.seasonStartDay,
                            season_end_day: item.seasonEndDay,
                            set_name: item.set,
                            price: item.price,
                            url: "BUILTIN"
                        }, function(err, submission) {
                            Account.find((err, accounts) => {
                                if(err) throw err;
                                accounts.forEach((account) => {
                                    if(submission.set_name === "Default Set") {
                                        accountModule.notifyUser(account.username, "NewDefaultItemRelease", "", submission.title, "", "", function(username) {
                                        
                                        });
                                    } else {
                                        if(!item.is_discontinued && !item.is_exclusive) {
                                            accountModule.notifyUser(account.username, "NewBuiltInItemRelease", "", submission.title, "", "", function(username) {
                                        
                                            });
                                        }
                                    }
                                });
                            });
                            console.log(`${new Date()}: Store item \"${item.title}\" added to the database.`);
                        });
                    } else {
                        var submissionQuery = {_id: submission._id};
                        var newData = { 
                            $set: { 
                                title: item.title,
                                description: item.description,
                                tags: item.tags,
                                submission_type: item.type,
                                category: item.category,
                                last_updated: new Date(),
                                is_exclusive: item.exclusive,
                                is_discontinued: item.discontinued,
                                is_seasonal: item.seasonal,
                                season_start_month: item.seasonStartMonth,
                                season_end_month: item.seasonEndMonth,
                                season_start_day: item.seasonStartDay,
                                season_end_day: item.seasonEndDay,
                                set_name: item.set,
                                price: item.price,
                                url: "BUILTIN" 
                            }
                        };
                        Submission.updateOne(submissionQuery, newData, function(err, res) {
                            if (err) throw err;
                        });
                    }
                });
            })
        }
    });
}

const submissions = {
    publish,
    updateSubmission,
    upvoteSubmission,
    downvoteSubmission,
    favoriteSubmission,
    unfavoriteSubmission,
    hideSubmission,
    unhideSubmission,
    deleteSubmission,
    purchaseItem,
    discardItem,
    userHasItem,
    refreshBuiltInItems
}

module.exports = submissions;