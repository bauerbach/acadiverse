/**
 * @file Methods for login/registration verification.
 * @author Bradley Auerbach <bauerbach@gmail.com>
 * @version 1.0.0
 */

const db = require("../models");
const mongoose = require('mongoose');
const UserRoles = db.user_role;
const Account = require('../models/account.model');
const WikiPage = require('../models/wiki-page.model');
const WikiEdit = require('../models/wiki-edit.model');
const globals = require('../config/globals');
const messages = require('../config/messages');
const authJWT = require('../middlewares/authJWT');
const accountModule = require('../middlewares/account');

createPage = function(req, res, next) {
    accountModule.checkForWarning(req, res, function(req1, res1) {
        accountModule.checkReputationPoints(globals.REP_WIKI, req1, res1, function(req2, res2) {
            WikiPage.create({
                title: req1.query.title,
                category: req1.query.category,
                content: req.body.content
            }, function(err) {
                if(err) return err.message;
                next(req2, res2);
            });
        });
    });
};

editPage = function(req, res, next) {
    accountModule.checkForWarning(req, res, function(req1, res1) {
            accountModule.checkReputationPoints(globals.REP_WIKI, req1, res1, function(req2, res2) {
                WikiPage.findById(req.query.id).exec((err, page => {
                if(!page) {
                    return res.status(404).json({success: false, statusCode: 404, message: messages.submissionNotFound});
                }

                Account.findOne({username: req.headers["username"]}, (err, account) => {
                    if(!account) {
                        return res1.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername});
                    }
                });

                authJWT.userHasRole(req.headers["username"], "moderators", function(userIsmoderator) {
                    authJWT.userHasRole(req.headers["username"], "admins", function(userIsAdmin) {
                        if(userIsModerator || userIsAdmin) {
                            var pageQuery = {id: _id};
                            var newData = { $set: { content: req.body.content }};
                            WikiPage.updateOne(pageQuery, newData, function(err, res) {
                                if (err) throw err;
                                next(req, res);
                            });
                        }
                    });
                })
            }))         
        });
    });
            
};

movePage = function(req, res, next) {
    
};

renamePage = function(req, res, next) {
    
};

deletePage = function(req, res, next) {
    
};

lockPage = function(req, res, next) {
    
};

unlockPage = function(req, res, next) {
    
};

const wiki = {
	
};

module.exports = wiki;