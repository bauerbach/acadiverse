/**
 * @file Methods for login/registration verification.
 * @author Bradley Auerbach <bauerbach@gmail.com>
 * @version 1.0.0
 */

const db = require("../models");
const mongoose = require('mongoose');
const UserRoles = db.user_role;
const Account = require('../models/account.model');
const messages = require('../config/messages');

checkForDuplicates = (res, req, next) => {
	Account.findOne({username: req.query.username}).exec((err, account) => {
		if(err) {
			res.status(500).send({message: err});
			return;
		}

		if(account) {
			res.status(400).send({ success: false, statusCode: 400, message: messages.usernameUnavailable});
			return;
		}
		next(req, res);

	
	Account.findOne({email: req.body.email}).exec((err, account) => {
		if(err) {
			res.status(500).send({message: err});
			return;
		}

		if(account) {
			res.status(400).send({ success: false, statusCode: 400, message: messages.emailInUse});
			return;
		}
		next(req, res);
		});
	});
};

rolesExist = (req, res, next) => {
	if(res.body.user_roles) {
		for (let i = 0; i < req.body.user_roles.length; i++) {
			if (!UserRoles.includes(req.body.user_roles[i])) {
				res.status(404).send({ success: false, statusCode: 404, message: messages.roleNotFound});
				return;
			}
		}
	}
}

accountExists = (req, res, next) => {
	Account.findOne({username: req.query.username}).exec((err, account) => {
		if(!account) {
			res.status(404).send({ success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.query.username)});
			return;
		}
		next(req, res);
	});
}

idExists = (id, next) => {
	Account.findOne({_id: id}).exec((err, account) => {
		if(!account) {
			res.status(404).send({ success: false, statusCode: 404, message: messages.idNotFound.replace("%1", id)});
			return;
		}
		next(id);
	});
}

const verification = {
	checkForDuplicates,
	rolesExist,
	accountExists,
	idExists
};

module.exports = verification;