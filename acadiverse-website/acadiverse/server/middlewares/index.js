/**
 * @file Index file for all middlewares.
 * @author Bradley Auerbach <bauerbach@gmail.com>
 * @version 1.0.0
 */

const authJwt = require("./authJwt");
const verification = require("./verification");
const accountModule = require("./account");
const submissions = require('./submissions');
const socialFeatures = require('./social-features');
const globalSettings = require('./global-settings');

module.exports = {
  authJwt,
  verification,
  accountModule,
  submissions,
  socialFeatures,
  globalSettings
};