/**
 * @file Main file for the server.
 * @author Bradley Auerbach <bauerbach@gmail.com>
 * @version 1.0.0
 */



// #region RequiredModules

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router  = express.Router();
const dotenv = require("dotenv");
const cors = require("cors");
const dbConfig = require("./config/db.config");
const messages = require('./config/messages');
const passport = require('passport');
const validateLogin = require('./loginvalidation');
const validateRegistration = require('./registrationvalidation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const chatFilter = require('./config/chatFilter');
const seasonalEvents = require('./config/seasonalEvents');
const globals = require('./config/globals');
const cron = require('node-cron');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = require('./models/account.model');
const Appeal = require('./models/appeal.model');
const BlogPost = require('./models/blog-post.model');
const ClassroomDiscussion = require('./models/classroom-discussion.model');
const Comment = require('./models/comment.model');
const CourseProject = require('./models/course-project.model');
const ForumCategory = require('./models/forum-category.model');
const ForumPost = require('./models/forum-post.model');
const BooleanGlobalSetting = require('./models/boolean-global-setting.model');
const NumberGlobalSetting = require('./models/number-global-setting.model');
const StringGlobalSetting = require('./models/string-global-setting.model');
const ArrayGlobalSetting = require('./models/array-global-setting.model');
const ModeratorAction = require('./models/moderator-action.model');
const Submission = require('./models/submission.model');
const UserRole = require('./models/user-role.model');
const WikiPage = require('./models/wiki-page.model');
const WikiEdit = require('./models/wiki-edit.model');

// #endregion

// #region Functions

dayOfYear = (date) => {
  const dy = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);

  return dy;
}

isCurrentDateHoliday = (holiday) => {
  var currentDate = (globals.ENABLE_DEBUG_MODE && globals.FAKE_CURRENT_DATE) ? globals.FAKE_DATE : new Date();
  var year = currentDate.getFullYear();
  var month = currentDate.getMonth();
  var date = currentDate.getDate();
  var hour = currentDate.getHours();
  var minute = currentDate.getMinutes();
  var weekday = currentDate.getUTCDay();

  if(holiday[0] === "FIRSTOFMONTH") {
    var m = holiday[1];
    var wd = holiday[2];
    var dur = holiday[3];
    var str = currentDate.getFullYear();

    if(m < 10) {
      str = currentDate.getFullYear() + "-0" + (m + 1) + "-01";
    } else {
      str = currentDate.getFullYear() + "-" + (m + 1) + "-01";
    }

    var dt = new Date(str);
    var wd2 = dt.getUTCDay();
    var df = wd - wd2;
    var sd = new Date(currentDate.getFullYear(), m, dt.getUTCDay() + df);
    var ed = sd.setDate(sd.getDate() + dur);

    if(month >= sm && month <= em) {
      if(date >= sd && date <= ed) {
        return true;
      }
    }
    return false;
    
  } else {
    var sm = holiday[0];
    var sd = holiday[1];
    var shr = holiday [2];
    var smin = holiday[3];

    var em = holiday[4];
    var ed = holiday[5];
    var ehr = holiday[6];
    var emin = holiday[7];

    var eventName = holiday[8];

    var dayOfYearC = dayOfYear(new Date(year, month, date));
    var dayOfYearS = dayOfYear(new Date(year, sm, sd));
    var dayOfYearE = dayOfYear(new Date(year, em, ed));

    if(eventName === "New Year's") {
      if(dayOfYearC >= 365 || dayOfYearC === 1) {
        return true;
      }
    } else {
      if(dayOfYearC >= dayOfYearS && dayOfYearC <= dayOfYearE) {
        return true;
      }
    }
    return false;
  }
}

// #endregion

// #region Initialization

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

dotenv.config();

const db = require("./models");

const { restElement } = require('@babel/types');
const authConfig = require('./config/auth.config');
const { resetWarningCache } = require('prop-types');
const authJwt = require('./middlewares/authJWT');
const accountModule = require('./middlewares/account');
const { account } = require('./models');
const verification = require('./middlewares/verification');
const globalSettings = require('./middlewares/global-settings');
const submissions = require('./middlewares/submissions');

console.log("Initializing...");

if(globals.ENABLE_DEBUG_MODE === true && globals.KILLSWITCH === true) {
  throw(new Error("The server could not start due to an unknown error. Please check your config files."));
}

mongoose
  .connect(dbConfig.CONNECTION_STRING, {
    useNewUrlParser: true,
    dbName: "Acadiverse"
  })
  .then(() => {
    console.log(`${new Date()}: Connection successful.`);
  })
  .catch(err => {
    console.error(`${new Date()}: Connection error: ${err}`);
    process.exit();
  });

  app.use(passport.initialize());
  
  require("./config/passport")(passport);

  authJwt.checkRoles();
  
  globalSettings.checkBoolean("allowLogins", true);
  globalSettings.checkBoolean("allowRegistrations", true);
  globalSettings.checkBoolean("showBanner", false);
  globalSettings.checkString("officialAccountId", "");
  globalSettings.checkString("noticeBannerHeader", "");
  globalSettings.checkString("noticeBannerMessage", "");
  globalSettings.checkString("noticeBannerBlogPostLink", "");
  globalSettings.checkString("noticeBannerType", "GENERIC_BANNER");
  globalSettings.checkString("aprilFoolsHeader", "Happy April Fools' Day!");
  globalSettings.checkString("aprilFoolsMessage", "Unfortunately, there is no joke happening around here today.");
  globalSettings.checkString("aprilFoolsBlogPostLink", "");
  globalSettings.checkString("aprilFoolsBannerType", "GENERIC_BANNER");
  globalSettings.checkArray("emailBlockList");
  globalSettings.checkArray("usernameBlockList");

  accountModule.restoreAdminAccount();
  accountModule.restoreOfficialAcadiverseAccount();

  submissions.refreshBuiltInItems();

// #endregion

// #region Cron

const request = require("request");
const socialFeatures = require('./middlewares/social-features');

cron.schedule("0 0 * * *", function() { //Schedule Cron to occur at midnight every day.

  //This code gets a list of users who are celebrating their birthday or member anniversary and sends them a PM/gifts accordingly.
    console.log(`${new Date()}: Running cron...`);

    //This code gets the string for the current date, used for the MongoDB filter.
    var month = new Date().getMonth() + 1;
    var date = new Date().getDate();
    if(month < 10) {
      month = "0" + month;
    }
    if(date < 10) {
      date = "0" + date;
    }
    var dateString = month + "-" + date;

    //This code finds any members whose member anniversary is on the current date, sends them a PM, and increases their Reputation Points and "Member Anniversary" achievement count.
    Account.find({member_anniversary_date: dateString}, (err, accounts) => { //Find any account in which the string representing the creation date matches the cuirrent date.
      if(!accounts) { //If there was at least one account found...
      } else {
        
        accounts.forEach(account => { //For each account where the anniversary of the creation date is the current date...
            if(new Date().getFullYear() - account.account_creation_date.getFullYear() > 0) {
              sendPMAsAcadiverse(account._id, messages.memberAnniversaryPM.replace("%1", account.display_name).replace("%2", account.username).replace("%3", (new Date().getFullYear() - account.account_creation_date.getFullYear()))); //Send the "Member Anniversary" PM to the user.
              accountModule.giveAchievement("MemberAnniversary", account._id, null, null, function(req, res) { //Give the user a "Member Anniversary" achievement.

              });
              accountModule.changeReputationPoints(globals.REP_GAIN_ANNIVERSARY, account._id, null, null, function(req, res) { //Increase the user's Reputation Points.

              });
          }
        });
      }  
    });

    //This code finds any users who are celebrating their birthday on the current date and sends them a PM.
    Account.find({birthday_date: dateString}, (err, accounts) => { //Find any account in which the user's birthday is on the current date.
      if(!accounts) { //If there was at least one account found...
      } else {
        accounts.forEach(account => { //For each account where the user's birthday matches the current date...
          accountModule.sendPMAsAcadiverse(account._id, messages.birthdayPM.replace("%1", account.display_name).replace("%2", account.username)); //Send the user a birthday PM.  
        });
      }      
    });
    
    //This code finds any submissions meeting the criteria for being featured and updates their featured status accordingly.
    Submission.find((err, submissions) => { //Get a list of all submissions.
      submissions.forEach(submission => { //For each submission in the list...
        if(submission.upvotes >= globals.FEATURED_REQUIRED_UPVOTES && submission.favorites >= globals.FEATURED_REQUIRED_FAVORITES && submission.downvotes <= globals.FEATURED_MAX_DOWNVOTES) { //If the submission has met the criteria for being featured...
          submission.updateOne(
            {_id: submission._id}, 
            {
              $set: 
                {
                  is_featured: true
                }
            }, function(err) { //Set the "featured" property of the submission to true.
            if(err) {
              console.log(`${new Date()}: Error updating featured status for submission ${submission._id}`);
              console.log(`${new Date()}: ${err}`);
            }
            accountModule.changeReputationPoints(globals.REP_GAIN_FEATURED, submission.author, null, null, function(req, res) {

            });

            accountModule.giveAchievement("TopPublisher", account._id, null, null, function(req, res) {

            });
          });
        } else { //Otherwise...
          submission.updateOne(
            {_id: submission._id}, 
            {
              $set: 
                {
                  is_featured: false
                }
            }, function(err) { //Set the "featured" property of the submission to false.
            if(err) {
              console.log(`${new Date()}: Error updating featured status for submission ${submission._id}`);
              console.log(`${new Date()}: ${err}`);
            }
          });
        }
      });
    });
});
// #endregion

// #region StripeIntegration

const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const YOUR_DOMAIN = 'http://localhost:4000';

app.post('/create-checkout-session', async (req, res) => {
  const prices = await stripe.prices.list({
    lookup_keys: [req.body.lookup_key],
    expand: ['data.product'],
  });
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    line_items: [
      {
        price: prices.data[0].id,
        
        quantity: 1,

      },
    ],
    mode: 'subscription',
    success_url: `${YOUR_DOMAIN}/premium/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/premium/cancelled`,
  });

  res.redirect(303, session.url);
});

app.post('/create-portal-session', async (req, res) => {
  
  
  const { session_id } = req.body;
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  
  
  const returnUrl = YOUR_DOMAIN;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  res.redirect(303, portalSession.url);
});

app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
    let event = request.body;
 
    const endpointSecret = 'whsec_12345';
    
    
    if (endpointSecret) {
      
      const signature = request.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }
    let subscription;
    let status;
    
    switch (event.type) {
      case 'customer.subscription.trial_will_end':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        
        
        break;
      case 'customer.subscription.deleted':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        
        
        break;
      case 'customer.subscription.created':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        
        
        break;
      case 'customer.subscription.updated':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        
        
        break;
      default:
        
        console.log(`Unhandled event type ${event.type}.`);
    }
    
    response.send();
  }
);

/**
 * @api {post} Construct Stripe Webhooks Event
 * @apiName ConstructStripeWebhooksEvent
 * @apiGroup Payments
 * @apiDescription Construct a webhook event for Stripe.
 */
app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  let event = request.body;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`${new Date()}: ⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`${new Date()}: PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`${new Date()}: Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

/**
 * @api {post} /create-payment-intent Greate Stripe Payment Intent.
 * @apiName CreateStripePaymentIntent
 * @apiGroup Payments
 * @apiDescription Create a payment intent for Stripe.
 */
app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  // Alternatively, set up a webhook to listen for the payment_intent.succeeded event
  // and attach the PaymentMethod to a new Customer
  const customer = await stripe.customers.create();
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    customer: customer.id,
    setup_future_usage: 'off_session',
    amount: calculateOrderAmount(items),
    currency: "usd"
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
});
// #endregion

// #region GlobalSettingsRoutes

app.get('/api/globalSettings/retrieve', function(req, res) {
  let settingType = req.query.settingType;
  let key = req.query.key;
  if(settingType == "BOOLEAN") {
    globalSettings.retrieveBoolean(key, res, function(key, res, setting) {
      return res.json({key: key, value: setting});
    });
  }
  else if(settingType == "STRING") {
    globalSettings.retrieveString(key, res, function(key, res, setting) {
      return res.json({key: key, value: setting});
    });
  }
  else if(settingType == "NUMBER") {
    globalSettings.retrieveNumber(key, res, function(key, res, setting) {
      return res.json({key: key, value: setting});
    });
  }
  else if(settingType == "ARRAY") {
    globalSettings.retrieveAllArrayElements(key, res, function(key, res, setting) {
      return res.json({key: key, value: setting});
    });
  } else {
    return res.status(400).json({success: false, statusCode: 400, message: messages.invalidSettingType});
  }
})

app.post('/api/globalSettings/setBoolean', function(req, res) {
  authJwt.verifyToken(req, res, function(req1, res1) {
    authJwt.isAdmin(req1, res1, function(req2, res2) {
      globalSettings.setBoolean(req2.query.key, req2.query.value, res2, function(req3, res3) {
        return res2.status(200).json({success: true, statusCode: 200, message: "The setting has been successfully changed."});
      });
    });
  });
})

 app.post('/api/globalSettings/setNumber', function(req, res) {
  authJwt.verifyToken(req, res, function(req1, res1) {
    authJwt.isAdmin(req1, res1, function(req2, res2) {
      globalSettings.setNumber(req2.query.key2, req.query.value, res2, function(req3, res3) {
        return res3.status(200).json({success: true, statusCode: 200, message: "The setting has been successfully changed."});
      });
    });
  });
})

 app.post('/api/globalSettings/setString', function(req, res) {
  authJwt.verifyToken(req, res, function(req1, res1) {
    authJwt.isAdmin(req1, res1, function(req2, res2) {
      globalSettings.setString(req2.query.key, req2.query.value, res2, function(req3, res3) {
        return res2.status(200).json({success: true, statusCode: 200, message: "The setting has been successfully changed."});
      });
    });
  });
})

app.post('/api/globalSettings/addToArray', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    authJwt.isAdmin(req, res, function(req, res) {
      globalSettings.addToArray(req.query.key, req.query.value, res, function(req, res) {
        return res.status(200).json({success: true, statusCode: 200, message: "The value has been added to the array."});
      });
    });
  });
})

app.post('/api/globalSettings/removeFromArray', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    authJwt.isAdmin(req, res, function(req, res) {
      globalSettings.addToArray(req.query.key, req.query.value, res, function(req, res) {
        return res.status(200).json({success: true, statusCode: 200, message: "The value has been removed from the array."});
      });
    });
  });
})

app.post('/api/globalSettings/clearArray', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    authJwt.isAdmin(req, res, function(req, res) {
      globalSettings.clearArray(req.query.key, req.query.value, res, function(req, res) {
        return res.status(200).json({success: true, statusCode: 200, message: "The array has been cleared."});
      });
    });
  });
})
// #endregion

// #region AccountAuthRoutes

app.post('/api/auth/roles/add', function(req, res) {
  let reqUsername = req.query.username;
  let reqName = req.query.name;
  authJwt.verifyToken(req, res, function(req, res) {
    authJwt.isAdmin(req, res, function(req, res) {
      accountModule.checkForWarning(req, res, function(req, res) {
        authJwt.addRole(req, res, reqUsername, reqName, function(req, res) {
          return res.status(200).json({success: true, statusCode: 200, message: "Role was successfully added."});
        });
      });
    });
  });
})

app.get('/api/auth/roles/getRoleByName', function(req, res) {
  UserRole.findOne({name: req.query.roleName}, (err, role) => {
    if(!role) {
      return res.status(404).json({success: false, statusCode: 404, message: "This role could not be found."});
    } else {
      return res.json({id: role._id, name: role.name});
    }
  });
})

app.post('/api/auth/signin', function(req, res) {
  console.log(req.body);
  globalSettings.retrieveBoolean("allowLogins", res, function(key, res, allowLogins) {
    if(!allowLogins) {
      return res.status(401).json({success: false, statusCode: 401, message: messages.loginsDisabled});
    } else {
      const { errors, isValid } = validateLogin(req.body);

      if (!isValid) {
        return res.status(400).json(errors);
      }

      const reqUsername = req.body.username;
      const reqPassword = req.body.password;
      Account.findOne({ username: reqUsername }).then(account => {
        if (!account) {
          return res.status(404).json({ success: false, statusCode: 404, message: messages.loginError});
        }
          bcrypt.hash(reqPassword, 10, function(err, hash) {
            if(err) console.log(err);

            bcrypt.compare(reqPassword, hash).then(isMatch => {
              if (isMatch) {
                let currentDate = new Date();
                if(account.consent_required) {
                  return res.status(401).send({ success: false, statusCode: 401, message: messages.consentRequired});
                }
                if(account.account_banned) {
                  if(account.date_ban_expires.getFullYear() === 1970) {
                    return res.status(401).send({ success: false, statusCode: 401, message: messages.accountPermabanned.replace("%1", account.ban_reason)});
                  } else {
                    if(account.date_ban_expires <= currentDate) {
                      account.account_banned = false;
                      var accountQuery = { username: reqUsername };
                      var newData = { $set: { account_banned: false, ban_reason: "" } }
                      Account.updateOne(accountQuery, newData, function(err, res) {
                        if(err) throw err;
                        return;
                      });
                    } else {
                      return res.status(401).send({ success: false, statusCode: 401, message: messages.accountTempbanned.replace("%1", new Date(account.date_ban_expires).toLocaleString()).replace("%2", account.ban_reason)});
                    }
                  }
                }
                const payload = {
                  id: account.id,
                  name: account.username
                };
                var accountQuery = { username: reqUsername };
                var newData = { $set: { last_active: new Date() } }
                Account.updateOne(accountQuery, newData, function(err, res) {
                    if(err) throw err;
                });
                jwt.sign(
                  payload,
                  authConfig.secret,
                  {
                    expiresIn: 31556926
                  },
                  (err, token) => {
                    return res.status(200).json({
                      success: true,
                      statusCode: 200,
                      token: token
                    });
                  }
                );
              } else {
                  return res
                    .status(400)
                    .json({ success: false, statusCode: 400, message: messages.loginError });
              }
            }); 
          });
      });
    }
  });
})

app.post('/api/auth/signup', function(req, res) {
  const { errors, isValid } = validateRegistration(req.body);
  if (!isValid) {
    return res.status(400).json({success: false, statusCode: 400, message: 
      `The following errors were encountered: ${errors}`
      });
  }

  const username = req.body.username;
  const displayName = req.body.displayName;
  const password = req.body.password;
  const email = req.body.email;
  const birthday = new Date(req.body.birthday);

  var birthdayDateString = "";
  var birthdayMonth = birthday.getMonth() + 1;
  var birthdayDate = birthday.getDate();
  if(birthdayMonth < 10) {
    birthdayMonth = "0" + birthdayMonth;
  }
  if(birthdayDate < 10) {
    birthdayDate = "0" + birthdayDate;
  }
  birthdayDateString = birthdayMonth + "-" + birthdayDate;

  var currentDate = new Date();
   var accountCreationMonth = currentDate.getMonth() + 1;
  var accountCreationDate = currentDate.getDate();
  if(accountCreationMonth < 10) {
    accountCreationMonth = "0" + accountCreationMonth;
  }
  if(accountCreationDate < 10) {
    accountCreationDate = "0" + accountCreationDate;
  }
  var accountCreationDateString = accountCreationMonth + "-" + accountCreationDate;

  Account.findOne({username}).then(accountExists => {
    globalSettings.retrieveBoolean("allowRegistrations", res, function(key, res1, allowRegistrations) {
      if(!allowRegistrations) {
        return res.status(401).json({success: false, statusCode: 403, message: messages.registrationsDisabled});
      } else {
        globalSettings.isValueInArray("usernameBlockList", username, res1, function(key, value, res2, usernameBlocked) {
          if(usernameBlocked) {
            return res.status(401).json({success: false, statusCode: 403, message: messages.usernameBlocked.replace("%1", username)});
          } else {
            globalSettings.isValueInArray("emailBlockList", username, res1, function(key, value, res2, emailBlocked) {
            if(emailBlocked) {
              return res.status(401).json({success: false, statusCode: 403, message: messages.emailBlocked.replace("%1", email)});
            } else {
              if(accountExists) {
                return res.status(400).json({success: false, statusCode: 400, message: messages.usernameUnavailable});
              } else {   
                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(password, salt, (err, hash) => {
                    console.log(hash);
                    var consentRequired = false;
                    if(currentDate.getFullYear() - birthday.getFullYear() < 13) {
                        consentRequired = true;
                    }
                    Account.create(
                    {
                      username: username,
                      display_name: displayName,
                      password: hash,
                      email: email,
                      birthday, birthday,
                      birthday_date: birthdayDateString,
                      account_creation_date: new Date(),
                      member_anniversary_date: accountCreationDateString,
                      last_active: new Date(),
                      consent_required: consentRequired,
                      user_roles: ["users"],
                      profile_image_url: "http://www.acadiverse.com/images/profile_default.svg"
                    }, function(err, user) {

                      if(err) return res.status(500).json({success: false, statusCode: 500, message: "The server has encountered an error."});
                      const payload = {
                        id: user.id,
                        name: user.username
                      };
                      if(consentRequired) {
                        return res.status(201).json({
                          success: true,
                          statusCode: 201,
                          message: "Thank you for registering! Please ask your parent/guardian to check their email and follow the instructions to give consent."
                        });
                      } else {
                        jwt.sign(
                          payload,
                          authConfig.secret,
                          {
                            expiresIn: 31556926
                          },
                          (err, token) => {
                            return res.status(200).json({
                              success: true,
                              statusCode: 200,
                              token: token
                            });
                          }
                        );
                      }
                      accountModule.sendPMAsAcadiverse(user._id, messages.welcomePM);
                    });
                  });
                });
              }
            }
          });
        }
      });

      
    }
  });
});
})

app.put('/api/auth/changeRoles', function(req, res) {
  authJwt.verifyToken(req, res, function(req1, res1) {
    authJwt.isAdmin(req1, res1, function(req2, res2) {
      authJwt.changeRoles(req2, res2, function(req3, res3) {
        return res.status(200).json({success: true, statusCode: 200, message: "The roles have been changed."});
      });
    });
    
  });
});

app.post('/api/auth/banAccount/', function(req, res) {
 authJwt.verifyToken(req, res, function(req1, res1) {
   authJwt.isModerator(req1, res1, function(req2, res2) {
    console.log(res2.body);
    if(req2.query.username === req2.headers["username"]) {
      return res.status(400).json({success: false, statusCode: 400, message: "You cannot ban yourself; why would you even WANT to do that?"});
    }
    if(req2.query.username === "admin" || req2.query.username === "acadiverse") {
      return res.status(400).json({success: false, statusCode: 400, message: "You cannot ban this account as it is needed for Acadiverse to work properly."});
    }
    authJwt.banAccount(
    req2.headers["username"], 
    req2.body.banReason, 
    req2.body.dateBanExpires, 
    req2, res2, 
    function(moderatorName, banReason, dateBanExpires, req3, res3) {
      return res3.status(200).json({success: true, statusCode: 200, message: "The account you specified has been banned."});
    });
  });
 });
})

app.post('/api/auth/unbanAccount/', function(req, res) {
 authJwt.verifyToken(req, res, function(req1, res1) {
   authJwt.isModerator(req1, res1, function(req2, res2) {
    authJwt.unbanAccount(req2, res2, function(req3, res3) {
      return res3.status(200).json({success: true, statusCode: 200, message: "This account was successfully unbanned."})
    });
  });
 });
})

app.get('/api/account/list', function(req, res) {
  authJwt.verifyToken(req, res, function(req1, res1) {
    authJwt.isAdmin(req1, res1, function(req2, res2) {
      Account.find((err, accounts) => {
        if (err) { 
            console.log(err)
        } else {
            var totalAccounts = 0;
            Account.count({}, function(err, count) {
              totalAccounts = count;
            });
            return res2.json({data: accounts, total: totalAccounts})
        }
      }).limit(req.query.limit).skip(req.query.limit * req.query.skip);
    });
  })
  
})

app.get('/api/account/info/getPMs', function(req, res) {
  authJwt.verifyToken(req, res, function(req1, res1) {
    Account.findOne({username: req1.headers["username"]}, (err, account) => {
      return res1.json({privateMessages: account.private_messages});
    })
  })
})

app.get('/api/account/info/getNotifications', function(req, res) {
  authJwt.verifyToken(req, res, function(req1, res1) {
    Account.findOne({username: req1.headers["username"]}, (err, account) => {
      return res1.json({notifications: account.notifications});
    })
  })
})

app.post('/api/account/sendPM', function(req, res) {
  Account.findOne({username: req.headers["username"]}, (err, account) => {
    if(!account) {
      return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
    }
    let sender = account._id;
    let recipient = req.queryrecipient;
    let message = req.body.message;
    authJwt.verifyToken(req, res, function(req, res) {
      accountModule.sendPM(sender, recipient, message, function(req, res) {
        return res.status(200).json({success: true, statusCode: 200, message: messages.pmSent});
      });
    });
  });
})

app.get('/api/account/getBasicInfo/', function(req, res) {
  var query = {};
  if(!req.query.id) {
    query = {username: req.query.username};
  } else {
    query = {_id: req.query.id};
  }
Account.findOne(query, (err, account) => {
  if(!account)
  {
    return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.query.username)});
  } else {
    if(account.account_banned) {
      return res.json({
        id: account._id,
        username: account.username,
        accountBanned: account.account_banned,
        banReason: account.ban_reason,
        dateBanExpires: account.date_ban_expires,
        displayName: account.display_name,
      });
    } else {
      return res.json({
        id: account._id,      
        accountCreationDate: account.account_creation_date,
        achievementAcedIt: account.achievement_aced_it,
        achievementMemberAnniversary: account.achievement_member_anniversary,
        achievementTopPublisher: account.achievement_top_publisher,
        acknowledgedLastWarning: account.acknowledged_last_warning,
        alphaTester: account.alpha_tester,
        avatar: account.avatar,
        badgeFounderPersonalized: account.badge_founder_personalized,
        betaTester: account.beta_tester,
        birthday: account.birthday,
        birthdayDate: account.birthday_date,
        canPublish: account.can_publish,
        dateLastWarningReceived: account.date_last_warning_received, 
        displayName: account.display_name,
        email: account.email,
        gender: account.gender,
        genderPronoun: account.gender_pronoun,
        isBacker: account.is_backer,
        isSubscriber: account.is_subscriber,
        lastActive: account.last_active,
        lastWarnedByModeratorName: account.last_warned_by_moderator_name,       
        lastWarningReason: account.last_warning_reason,
        money: account.money,
        onboardingCompleted: account.onboarding_completed,
        profileBio: account.profile_bio,
        profileImageURL: account.profile_image_url,
        quizScoreAverage: account.quiz_score_average,
        reputationPoints: account.reputation_points,
        roles: account.user_roles,
        username: account.username,
        usesGravatar: account.uses_gravatar,
        warnings: account.warnings
    });
    }
    
  }
})
})

app.get('/api/account/info/', function(req, res) {
  var query = {};
  if(!req.query.id) {
    query = {username: req.query.username};
  } else {
    query = {_id: req.query.id};
  }
Account.findOne(query, (err, account) => {
  if(!account)
  {
    return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.query.username)});
  } else {

      return res.json({
        id: account._id,
        accountBanned: account.account_banned,        
        accountCreationDate: account.account_creation_date,
        achievementAcedIt: account.achievement_aced_it,
        achievementMemberAnniversary: account.achievement_member_anniversary,
        achievementTopPublisher: account.achievement_top_publisher,
        acknowledgedLastWarning: account.acknowledged_last_warning,
        alphaTester: account.alpha_tester,
        avatar: account.avatar,
        banReason: account.ban_reason,
        betaTester: account.beta_tester,
        birthday: account.birthday,
        birthdayDate: account.birthday_date,
        blockedUsers: account.blocked_users,
        buddies: account.buddies,
        canPublish: account.can_publish,
        dateBanExpires: account.date_ban_expires,
        dateLastWarningReceived: account.date_last_warning_received, 
        displayName: account.display_name,
        email: account.email,
        gender: account.gender,
        genderPronoun: account.gender_pronoun,
        isBacker: account.is_backer,
        isSubscriber: account.is_subscriber,
        lastActive: account.last_active,
        lastWarnedByModeratorName: account.last_warned_by_moderator_name,       
        lastWarningReason: account.last_warning_reason,
        money: account.money,
        notifications: account.notifications,
        notifyAchievementReceived: account.notify_achievement_received,
        notifyPMReceived: account.notify_pm_received,
        notifySubmissionComment: account.notify_submission_comment,
        notifySubmissionFeatured: account.notify_submission_featured,
        notifySubmissionUpvote: account.notify_submission_upvote,
        onboardingCompleted: account.onboarding_completed,
        ownedItems: account.owned_items,
        password: account.password,
        privateMessages: account.private_messages,
        profileBio: account.profile_bio,
        profileImageURL: account.profile_image_url,
        publishingStrikes: account.publishing_strikes,
        quizScoreAverage: account.quiz_score_average,
        recievesPMs: account.receives_pms,
        reputationPoints: account.reputation_points,
        roles: account.user_roles,
        username: account.username,
        usesGravatar: account.uses_gravatar,
        warnings: account.warnings
    });
  }
})
})

app.put('/api/account/updateData/', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    authJwt.isAdmin(req, res, function(req, res) {
      accountModule.updateData(req, res, function(req, res) {
        return res.status(200).json({success: true, statusCode: 200, message: "This user's data has been updated."});
      });
    });
  });  
});

app.put('/api/account/editProfile/', function(req, res) {
  authJwt.verifyToken(req, res, function(req1, res1) {
    authJwt.isModerator(req1, res1, function(req2, res2) {
      accountModule.editProfile(req2, res2, function(req3, res3) {
        res.status(200).json({success: true, statusCode: 200, message: "The selected user's profile has been updated."});
      });
    });
  });  
});

app.put('/api/account/blockUser/', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    accountModule.blockUser(req, res, function(req, res) {
      return res.status(200).json({success: false, statusCode: 200, message: "You have successfully blocked this user."});
    });
  });
});

app.put('/api/account/unblockUser/', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    accountModule.unblockUser(req, res, function(req, res) {
      return res.status(200).json({success: false, statusCode: 200, message: "You have successfully unblocked this user."});
    });
  });
});

app.put('/api/account/addBuddy/', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    accountModule.addBuddy(req, res, function(req, res) {
      return res.status(200).json({success: false, statusCode: 200, message: "Successfully added user as a buddy."});
    });
  });
});

app.put('/api/account/removeBuddy/', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    accountModule.removeBuddy(req, res, function(req, res) {
      return res.status(200).json({success: false, statusCode: 200, message: "Successfully removed user from buddies."});
    });
  });
});

app.post('/api/account/warnUser/', function(req, res) {
  authJwt.verifyToken(req, res, function(req1, res1) {
    authJwt.isModerator(req1, res1, function(req2, res2) {
      if(req2.query.username === req2.headers["username"]) {
        return res.status(400).json({success: false, statusCode: 400, message: "You cannot give yourself a warning; why would you even WANT to do that?"});
      }
      if(req2.query.username === "admin" || req2.query.username === "acadiverse") {
        return res.status(400).json({success: false, statusCode: 400, message: "You cannot give this account a warning as it is needed for Acadiverse to work properly."});
      }
      accountModule.warnUser(req2, res2, function(req3, res3) {
        return res3.status(200).json({success: true, statusCode: 200, message: messages.gaveWarning});
      })
    });
  });
})

app.post('/api/account/acknowledgeWarning', function(req, res) {
  authJwt.verifyToken(req, res, function(req1, res1) {
    accountModule.acknowledgeWarning(req1, res1, function(req2, res2) {
      return res2.status(200).json({success: true, statusCode: 200, message: messages.acknowledgedWarning});
    });
  });
})

app.put('/api/account/changePassword', function(req, res) {
  authJwt.verifyToken(req, res, function(req1, res1) {
    authJwt.changePassword(req1, res1, function(req2, res2) {
      return res.status(200).json({success: true, statusCode: 200, message: "Password changed."});
    });
  });
})

app.post('/api/account/changeSettings', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    accountModule.changeSettings(req, res, function(req1, res1) {
      return res1.status(200).json({success: true, statusCode: 200, message: messages.accountSettingsChanged});
    });
  });
})

app.post('/api/account/changeAvatar', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    Account.findOne({username: req.headers["username"]}).exec((err, account) => {
      if(!account) {
        return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.query.otherUsername)});
      }
      if(!account.owned_items.includes(req.body.hat)
        || !account.owned_items.includes(req.body.hairStyle)
        || !account.owned_items.includes(req.body.facialHair)
        || !account.owned_items.includes(req.body.eyewear)
        || !account.owned_items.includes(req.body.top)
        || !account.owned_items.includes(req.body.bottom)
        || !account.owned_items.includes(req.body.footwear)) {
          return res.status(400).json({success: false, statusCode: 400, message: messages.avatarItemUnavailable});
      } else {
        Account.updateOne({username: req.headers["username"]},
        {
          $set: {
            avatar: {
              skin_color: req.body.skinColor,
              hat: req.body.hat,
              hair_style: req.body.hairStyle,
              facial_hair: req.body.facialHair,
              eyewear: req.body.eyewear,
              top: req.body.top,
              bottom: req.body.bottom,
              footwear: req.body.footwear
            }
          }
      }, function(err, res) {
        if(err) throw err;
        return res.status(200).json({success: true, statusCode: 200, message: messages.avatarChanged});
      })
      }
    });
  });
})

app.delete('/api/auth/deleteAccount', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) { //Check if the provided token is valid.
    authJwt.deleteAccount(req, res, function(req, res) {
        return res.status(200).json({success: true, statusCode: 200, message: messages.accountDeleted});
    });
  });
});

app.delete('/api/auth/deleteOtherAccount', function(req, res) {
  const username = req.query.username;
  authJwt.verifyToken(req, res, function(req1, res1) { //Check if the provided token is valid.
    authJwt.isAdmin(req1, res1, function(req2, res2) {
      authJwt.deleteOtherAccount(req2, res2, function(req3, res3) {
        return res.status(200).json({success: true, statusCode: 200, message: messages.accountDeletedByAdmin});
      });
    });
  });
});

app.post('/api/account/appeal/send', function(req, res) {
  const reqUsername = req.body.username;
  const reqAppealText = req.body.appealText;
  console.log(req.body);
  Account.findOne({username: reqUsername}, function(err, account) {
    if(!account) {
      return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", reqUsername)});
    }
    if(!account.account_banned && account.can_chat && account.can_comment && account.can_publish) {
      return res.status(404).json({success: false, statusCode: 404, message:messages.appealNotNecessary});
    }
  });
  Appeal.findOne({associated_username: reqUsername}).then(userAlreadyAppealed => {
    if(userAlreadyAppealed) {
      return res.status(400).json({success: false, statusCode: 400, message: messages.userAlreadyAppealed.replace("%1", reqUsername)});
    } else {
      Appeal.create(
        {
          associated_username: reqUsername,
          appealText: reqAppealText
        }, function(err) {
          if(err) return err.message;
          return res.status(200).json({success: true, statusCode: 200, message: messages.appealSent});
        });
    }
  });
});

app.post('/api/account/appeal/makeDecision', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    authJwt.isModerator(req, res, function(req, res) {
      authJwt.checkForBan(req, res, function(req, res) {
        accountModule.checkForWarning(req, res, function(req, res) {
          Appeal.findOne({associated_username: req.query.associatedUsername}).then(appeal => {
            if(!appeal) {
              return res.status(404).json({success: false, statusCode: 404, message: messages.appealNotFound.replace("%1", req.query.associatedUsername)});
            }
            var appealResult = "";
            if(req.query.accepted) {
              appealResult = "ACCEPTED";
            } else {
              appealResult = "DENIED";
            }
            Appeal.updateOne({associated_username: res.query.associatedUsername}, {$set: {appeal_result: appealResult}}, function(err, res) {
              if(err) throw err;
              res.status(200).json({success: true, statusCode: 200, message: messages.decisionMade.replace("%1", req.query.associatedUsername)});
            });
          });
        }); 
      });     
    });
  });
});

app.put("/api/account/completeOnboarding", function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {

  });
});

// #endregion

// #region SubmissionRoutes

app.get('/api/submissions/list', function(req, res) {
  var query = {};
  var sort = null;
  if(!req.query || !req.query.filterByType) {
    query = null;
  } else {
     switch (req.query.filterByType) {
      case "submissions":
        if(req.query.featured === true) {
          query = { 
            is_featured: true, 
            is_hidden: false, 
            category: [ "School Courses", 
            "College Courses", 
            "Training Material", "Course Components" ]};
        } else {
          query = { is_hidden: false, category: [ "School Courses", 
          "College Courses", 
          "Training Material", "Course Components" ]};
        }
      break;
      case "courses":
        if(req.query.featured === true) {
          query = { 
            is_featured: true, 
            is_hidden: false, 
            category: [ "School Courses", 
            "College Courses", 
            "Training Material" ]};
        } else {
          query = { is_hidden: false, category: [ "School Courses", 
          "College Courses", 
          "Training Material" ]};
        }
        break;
      case "courseItems":
        if(req.query.featured === true) {
          query = { 
            is_featured: true, 
            is_hidden: false, 
            category: "Course Components" };
        } else {
          query = { is_hidden: false, category: "Course Components" };
        }
        break;
      case "storeItems":
        if(req.query.featured === true) {
          query = { 
            is_featured: true, 
            is_hidden: false, 
            category: "Store Items" };
        } else {
          query = { is_hidden: false, category: "Store Items" };
        }
        break;
      default:
        query = null;
        break;
    }
  }

  var sortValue = 0;
  if(!req.query.sortBy) {
    sort = null;
  } else {
    var sortQuery = req.query.sortBy.split("_");
    if(sortQuery.length === 2) {
      if(sortQuery[1] === "a" || sortQuery[1] === "d") {
        if(sortQuery[1] === "a") {
          sortValue = 1;
        } else {
          sortValue = -1;
        }
        switch(sortQuery[0]) {
          case "dateCreated":
            sort = {date_created: sortValue};
            break;
          case "lastUpdated":
            sort = {last_updated: sortValue};
            break;
          case "price":
            if(req.query.filterByType === "storeItems") {
              sort = {price: sortValue};
            } else {
              sort = null;
              break;
            }
          case "title":
            sort = {title: sortValue};
            break;
          case "difficulty":
            if(req.query.filterByType === "storeItems") {
              sort = null;
            } else {
              sort = {difficulty: sortValue};
            }
            break;
          case "funness":
            if(req.query.filterByType === "storeItems") {
              sort = null;
            } else {
              sort = {funness: sortValue};
            }
            break;
          case "minGrade":
            if(req.query.filterByType === "storeItems") {
              sort = null;
            } else {
              sort = {min_grade: sortValue};
            }
            break;
          case "maxGrade":
            if(req.query.filterByType === "storeItems") {
              sort = null;
            } else {
              sort = {max_grade: sortValue};
            }
          default:
            sort = null;
            break;
        }
      } else {
        sort = null;
      }
    } else {
      sort = null;
    }
    console.log(sort);
  }

  if(query === null) {
    if(!sort) {
      Submission.find((err, submissions) => {
        if(err) {
          console.log(err);
        } else {
          var total = 0;
          Submission.count({}, function(err, count) {
            total = count;
            res.json({data: submissions, total: total})
          });
        }
      }).limit(req.query.limit).skip(req.query.limit * req.query.skip);
    } else {
      Submission.find((err, submissions) => {
        if(err) {
          console.log(err);
        } else {
          var total = 0;
          Submission.count({}, function(err, count) {
            total = count;
            res.json({data: submissions, total: total})
          });
        }
      }).limit(req.query.limit).skip(req.query.limit * req.query.skip).sort(sort);
    }
    
  } else {
    if(!sort) {
      Submission.find(query, (err, submissions) => {
        if(err) {
          console.log(err);
        } else {
          var total = 0;
          Submission.count({}, function(err, count) {
            total = count;
            console.log("Query: " + query);
            console.log(total + " submissions found.");
            console.log(submissions);
            res.json({data: submissions, total: total})
          });
        }
    }).limit(req.query.limit).skip(req.query.limit * req.query.skip);
    } else {
      Submission.find(query, (err, submissions) => {
        if(err) {
          console.log(err); 
        } else {
          var total = 0;
          Submission.count({}, function(err, count) {
            total = count;
            res.json({data: submissions, total: total})
          });
        }
      }).limit(req.query.limit).skip(req.query.limit * req.query.skip).sort(sort);
    }
    
  }
});

app.get('/api/submissions/listAllIncludingHidden', function(req, res) {
  authJwt.verifyToken(req, res, function(req1, res1) {
    authJwt.isAdmin(req1, res1, function(req2, res2) {
      Submission.find((err, submissions) => {
        if(err) {
          console.log(err);
        } else {
          var total = 0;
          Submission.count({}, function(err, count) {
            total = count;
            res.json({data: submissions, total: total})
          });
        }
      }).limit(req.query.limit).skip(req.query.limit * req.query.skip);
    });
  })
});

app.get('/api/submissions/loadHiddenSubmission', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
      var userIsModerator = false;
      var userIsAdmin = false;
      authJwt.checkRoleByUsername(req.query.username, "moderators", function(result1) {
        userIsModerator = result1;
        authJwt.checkRoleByUsername(req.query.username, "admins", function(result2) {
          userIsAdmin = result2;
        });
      });
      Submission.findById(req.query.id).exec((err, submission) => {
        if(!submission) {
          return res.status(404).json({success: false, statusCode: 404, message: messages.submissionNotFound});
        } else {
          Account.findOne(req.query.username, (err, account) => {
            if(account._id !== submission.author && !userIsModerator && !userIsAdmin) {
              return res.status(403).json({success: false, statusCode: 403, message: messages.submissionHidden});
            } else {
              if(submission.submission_type === "Course" || submission.submission_type === "Worksheet" || submission.submission_type === "Scenario" || submission.submission_type === "Quiz") {
                return res.json({
                  title: submission.title,
                  description: submission.description,
                  tags: submission.tags,
                  author: submission.author,
                  submissionType: submission.submission_type,
                  dateCreated: submission.date_created,
                  lastUpdated: submission.lastUpdated,
                  comments: submission.comments,
                  upvotes: submission.upvotes,
                  favorites: submission.favorites,
                  downvotes: submission.downvotes,
                  difficulty: submission.difficulty,
                  _difficultyRatings: submission._difficulty_ratings,
                  funness: submission.funness,
                  _funnessRatings: submission._funness_ratings,
                  url: submission.url,
                  featured: submission.is_featured,
                  hidden: submission.is_hidden
                });
              } else {
                  return res.json({
                    title: submission.title,
                    description: submission.description,
                    tags: submission.tags,
                    author: submission.author,
                    submissionType: submission.submission_type,
                    dateCreated: submission.date_created,
                    lastUpdated: submission.lastUpdated,
                    comments: submission.comments,
                    upvotes: submission.upvotes,
                    favorites: submission.favorites,
                    downvotes: submission.downvotes,
                    difficulty: submission.difficulty,
                    _difficultyRatings: submission._difficulty_ratings,
                    funness: submission.funness,
                    _funnessRatings: submission._funness_ratings,
                    url: submission.url,
                    featured: submission.is_featured,
                    hidden: submission.is_hidden,
                    isExclusive: submission.is_exclusive,
                    isDiscontinued: submission.is_discontinued,
                    isSeasonal: submission.is_seasonal,
                    seasonStartMonth: submission.season_start_month,
                    seasonEndMonth: submission.season_end_month,
                    seasonStartDay: submission.season_start_day,
                    seasonEndDay: submission.season_end_day,
                    setName: submission.set_name,
                    price: submission.price
                  });
              }
            }
          });  
        }
    });
  });
});

app.get('/api/submissions/get', function(req, res) {
  Submission.findById(req.query.id).exec((err, submission) => {
    if(!submission) {
      return res.status(404).json({success: false, statusCode: 404, message: messages.submissionNotFound});
    } else {
      if(submission.is_hidden) {
        return res.status(403).json({success: false, statusCode: 403, message: messages.submissionHidden});
      } else {
        if(submission.category === "Course Components"
          || submission.category === "School Courses"
          || submission.category === "College Courses"
          || submission.category === "Training Material") {
          return res.status(200).json({
            title: submission.title,
            description: submission.description,
            tags: submission.tags,
            author: submission.author,
            submissionType: submission.submission_type,
            dateCreated: submission.date_created,
            lastUpdated: submission.lastUpdated,
            comments: submission.comments,
            upvotes: submission.upvotes,
            favorites: submission.favorites,
            downvotes: submission.downvotes,
            difficulty: submission.difficulty,
            _difficultyRatings: submission._difficulty_ratings,
            funness: submission.funness,
            _funnessRatings: submission._funness_ratings,
            url: submission.url
          });
        } else {
          return res.status(200).json({
            title: submission.title,
            description: submission.description,
            tags: submission.tags,
            author: submission.author,
            submissionType: submission.submission_type,
            dateCreated: submission.date_created,
            lastUpdated: submission.lastUpdated,
            comments: submission.comments,
            upvotes: submission.upvotes,
            favorites: submission.favorites,
            downvotes: submission.downvotes,
            difficulty: submission.difficulty,
            _difficultyRatings: submission._difficulty_ratings,
            funness: submission.funness,
            _funnessRatings: submission._funness_ratings,
            url: submission.url,
            isExclusive: submission.is_exclusive,
            isDiscontinued: submission.is_discontinued,
            isSeasonal: submission.is_seasonal,
            seasonBegin: submission.season_begin,
            seasonEnd: submission.season_end,
            setName: submission.set_name,
            price: submission.price
          });
        }
      }
    }
  });
});

app.post('/api/submissions/publish', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    submissions.publish(req, res, function(req, res) {
      return res.status(201).json({success: true, statusCode: 201, message: messages.submissionPublished});
    });
  });
});

app.post('/api/submissions/update', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    submissions.updateSubmission(req, res, function(req, res) {
      return res.status(200).json({success: true, statusCode: 200, message: messages.submissionUpdated});
    });
  });
});

app.post('/api/submissions/upvote', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    submissions.upvoteSubmission(req, res, function(req, res) {
      return res.status(200).json({success: true, statusCode: 200, message: messages.submissionUpvoted});
    });
  });
});

app.post('/api/submissions/downvote', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    submissions.downvoteSubmission(req, res, function(req, res) {
      return res.status(200).json({success: true, statusCode: 200, message: messages.submissionDownvoted});
    });
  });
});

app.post('/api/submissions/favorite', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    submissions.favoriteSubmission(req, res, function(req, res) {
      return res.status(200).json({success: true, statusCode: 200, message: messages.submissionFavorited});
    });
  });
});

app.post('/api/submissions/unfavorite', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    submissions.unfavoriteSubmission(req, res, function(req, res) {
      return res.status(200).json({success: true, statusCode: 200, message: messages.submissionFavorited});
    });
  });
});

app.post('/api/submissions/hide', function(req, res) {
  return res.status(402).json({success: false, statusCode: 402, message: "You must purchase Premium to use this route."});
  authJwt.verifyToken(req, res, function(req, res) {
    authJwt.isModerator(req, res, function(req, res) {
      submissions.hideSubmission(req, res, function(req, res) {
        res.status(200).json({success: true, statusCode: 200, message: messages.submissionSuccessfullyHidden});
      });
    });  
  });
});

app.post('/api/submissions/unhide', function(req, res) {
  return res.status(402).json({success: false, statusCode: 402, message: "You must purchase Premium to use this route."});
  authJwt.verifyToken(req, res, function(req, res) {
    authJwt.isModerator(req, res, function(req, res) {
      submissions.unhideSubmission(req, res, function(req, res) {
        res.status(200).json({success: true, statusCode: 200, message: messages.submissionSuccessfullyUnhidden});
      });
    });  
  });
});

app.delete('/api/submissions/delete', function(req, res) {
  return res.status(402).json({success: false, statusCode: 402, message: "You must purchase Premium to use this route."});
  authJwt.verifyToken(req, res, function(req, res) {
    submissions.deleteSubmission(req, res, function(req, res) {
      res.status(200).json({success: true, statusCode: 200, message: messages.submissionDeleted});
    })
  });
})

app.post('/api/store/purchaseItem', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    submissions.purchaseItem(req, res, function(req, res) {
      res.status(200).json({success: true, statusCode: 200, message: messages.itemPurchased});
    })
  });
})

app.post('/api/store/refreshBuiltINItems', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    authJwt.isAdmin(req, res, function(req, res) {
      submissions.refreshBuiltInItems();
      res.status(200).json({success: true, statusCode: 200, message: "Built-in items refreshed."});
    })
  });
})

// #endregion

// #region ClassroomDiscussionRoutes

app.get('/api/classroomDiscussions/getJoined', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    Account.findOne({username: req.headers["username"]}, (err, account) => {
      if(!account) {
        return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
      }
      ClassroomDiscussion.find({members: account._id}, (err, classroomDiscussions) => {
        if(err) {
          return res.json(err);
        } else {
          return res.json(classroomDiscussions);
        }
      });
    });
  })
});

app.get('/api/classroomDiscussions/getOwned', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    Account.findOne({username: req.headers["username"]}, (err, account) => {
      if(!account) {
        return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
      }
      ClassroomDiscussion.find({teacher: account._id}, (err, classroomDiscussions) => {
        if(err) {
          return res.json(err);
        } else {
          return res.json(classroomDiscussions);
        }
      });
    });
  })
});

app.get('/api/classroomDiscussions/get', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    Account.findOne({username: req.headers["username"]}, (err, account) => {
      if(!account) {
        return res.status(404).json({success: false, statusCode: 404, message: messages.invalidUsername.replace("%1", req.headers["username"])});
      }
      ClassroomDiscussion.findOne({_id: req.query.id}, (err, classroomDiscussion) => {
        if(!classroomDiscussion) {
          return res.status(404).json({success: false, statusCode: 404, message: messages.classroomDiscussionNotFound});
        } else {
          if(classroomDiscussion.members.includes(account._id)) {
            return res.json({
              name: classroomDiscussion.name,
              teacher: classroomDiscussion.teacher,
              members: classroomDiscussion.members,
              assignments: classroomDiscussion.assignments,
              posts: classroomDiscussion.posts,
              filterMode: classroomDiscussion.filterMode,
              filterLevel: classroomDiscussion.filterLevel
            });
          } else {
            return res.status(403).json({success: false, statusCode: 403, message: messages.notClassroomDiscussionMember});
          }
        }
      });
    });
  })
});

app.post('/api/classroomDiscussions/create', function(req, res) {
  return res.status(402).json({success: false, statusCode: 402, message: "You must purchase Premium to use this route."});
  authJwt.verifyToken(req, res, function(req, res) {
    socialFeatures.createClassroomDiscussion(req, res, function(req, res) {
      return res.status(200).json({success: true, statusCode: 200, message: "Successfully created a new Classroom Discussion."});
    });
  })
});

app.post('/api/classroomDiscussions/delete', function(req, res) {
  return res.status(402).json({success: false, statusCode: 402, message: "You must purchase Premium to use this route."});
  authJwt.verifyToken(req, res, function(req, res) {
    socialFeatures.deleteClassroomDiscussion(req, res, function(req, res) {
      return res.status(200).json({success: true, statusCode: 200, message: "The Classroom Discussion was successfully deleted."});
    });
  })
});

app.post('/api/classroomDiscussions/changeTeacher', function(req, res) {
  return res.status(402).json({success: false, statusCode: 402, message: "You must purchase Premium to use this route."});
  authJwt.verifyToken(req, res, function(req, res) {
    socialFeatures.changeClassroomDiscussionTeacher(req, res, function(req, res) {
      return res.status(200).json({success: true, statusCode: 200, message: "The teacher for this Classroom Discussion was successfully changed."});
    });
  })
});

app.post('/api/classroomDiscussions/rename', function(req, res) {
  return res.status(402).json({success: false, statusCode: 402, message: "You must purchase Premium to use this route."});
  authJwt.verifyToken(req, res, function(req, res) {
    socialFeatures.renameClassroomDiscussion(req, res, function(req, res) {
      return res.status(200).json({success: true, statusCode: 200, message: "The Classroom Discussion has been successfully renamed."});
    });
  })
});

app.post('/api/classroomDiscussions/addAssignment', function(req, res) {
  return res.status(402).json({success: false, statusCode: 402, message: "You must purchase Premium to use this route."});
  authJwt.verifyToken(req, res, function(req, res) {
    socialFeatures.addAssignment(req, res, function(req, res) {
      return res.status(200).json({success: true, statusCode: 200, message: "Assignment added to Classroom Discussion."});
    });
  })
});

app.post('/api/classroomDiscussions/removeAssignment', function(req, res) {
  return res.status(402).json({success: false, statusCode: 402, message: "You must purchase Premium to use this route."});
  authJwt.verifyToken(req, res, function(req, res) {
    socialFeatures.removeAssignment(req, res, function(req, res) {
      return res.status(200).json({success: true, statusCode: 200, message: "Assignment removed from Classroom Discussion."});
    });
  })
});

app.post('/api/classroomDiscussions/acceptAssignment', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    socialFeatures.acceptAssignment(req, res, function(req, res) {
      return res.status(200).json({success: true, statusCode: 200, message: "You have accepted this assignment. Good luck with it!"});
    });
  })
});

app.post('/api/classroomDiscussions/completeAssignment', function(req, res) {
  return res.status(402).json({success: false, statusCode: 402, message: "You must purchase Premium to use this route."});
  authJwt.verifyToken(req, res, function(req, res) {
    socialFeatures.completeAssignment(req, res, function(req, res) {
      return res.status(200).json({success: true, statusCode: 200, message: "Confirmed that " + req.query.member + " has completed this assignment."});
    });
  })
});

app.post('/api/classroomDiscussions/post', function(req, res) {
  return res.status(402).json({success: false, statusCode: 402, message: "You must purchase Premium to use this route."});
  authJwt.verifyToken(req, res, function(req, res) {
    socialFeatures.postToClassroomDiscussion(req, res, function(req, res) {
      return res.status(200).json({success: true, statusCode: 200, message: "Created a new post in classroom discussion \"" + req.query.name + "\"."});
    });
  })
});

app.post('/api/classroomDiscussions/editPost', function(req, res) {
  return res.status(402).json({success: false, statusCode: 402, message: "You must purchase Premium to use this route."});
  authJwt.verifyToken(req, res, function(req, res) {
    socialFeatures.editClassroomDiscussionPost(req, res, function(req, res) {
      return res.status(200).json({success: true, statusCode: 200, message: "This Classroom Discussion post was successfully edited."});
    });
  })
});

app.post('/api/classroomDiscussions/replyToPost', function(req, res) {
  return res.status(402).json({success: false, statusCode: 402, message: "You must purchase Premium to use this route."});
  authJwt.verifyToken(req, res, function(req, res) {
    socialFeatures.replyToClassroomDiscussionPost(req, res, function(req, res) {
      return res.status(200).json({success: true, statusCode: 200, message: "The reply to this Classroom Discussion post was successfully posted."});
    });
  })
});

app.post('/api/classroomDiscussions/deletePost', function(req, res) {
  return res.status(402).json({success: false, statusCode: 402, message: "You must purchase Premium to use this route."});
  authJwt.verifyToken(req, res, function(req, res) {
    socialFeatures.deleteClassroomDiscussionPost(req, res, function(req, res) {
      return res.status(200).json({success: true, statusCode: 200, message: "This Classroom Discussion post was successfully deleted."});
    });
  })
});

// #endregion

// #region WikiRoutes

app.get('/api/wiki/listPages', function(req, res) {
  WikiPage.find({}, (err, pages) => {
    res.json(pages);
  })
})

app.get('/api/wiki/getPage', function(req, res) {
  WikiPage.findOne({category: req.query.category, title: req.query.title}, (err, page) => {
    if(!page) {
      return res.status(404).json({success: false, statusCode: 404, message: messages.pageNotFound});
    }
  });
})

app.get('/api/wiki/getRecentEdits', function(req, res) {
  WikiEdit.find({date: { $gte: new Date().getDate() - req.query.timeframe }}, (err, edits) => {
    return res.json(edits);
  })
})

app.get('/api/wiki/getPageHistory', function(req, res) {
  WikiPage.findById(req.query.pageId).then((err, page) => {
    if(!page) {
      return res.status(404).json({success: false, statusCode: 404, message: messages.pageNotFound});
    }
  });

  WikiEdit.find({page_id: req.query.pageId, date: { $gte: new Date().getDate() - req.query.timeframe }}, (err, edits) => {
    return res.json(edits);
  })
})

app.get('/api/wiki/compareEdits', function(req, res) {
  WikiPage.findOne({category: req.query.category, title: req.query.title}, (err, page) => {
    if(!page) {
      return res.status(404).json({success: false, statusCode: 404, message: messages.pageNotFound});
    }

    var revision1 = page.history.at(req.query.revision1);
    var revision2 = page.history.at(req.query.revision2);
    
    var before = "";
    var after = "";

    WikiEdit.findOne({_id: revision1}, (err, edit) => {
      if(!edit) {
        return res.status(404).json({success: false, statusCode: 404, message: messages.invalidEdit});
      } else {
        before = edit.old_source;
      }
    });

    WikiEdit.findOne({_id: revision2}, (err, edit) => {
      if(!edit) {
        return res.statusCode(404).json({success: false, statusCode: 404, message: messages.invalidEdit});
      } else {
        after = edit.new_source;
      }

      return res.json({
        page_name: page.category + "/" + page.title,
        before: before,
        after: after
      });
    });
  });
})

app.post('/api/wiki/createPage', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    
  });
})

app.put('/api/wiki/editPage', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    
  });
})

app.put('/api/wiki/movePage', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    
  });
})

app.put('/api/wiki/renamePage', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    
  });
})

app.put('/api/wiki/lockPage', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    
  });
})

app.delete('/api/wiki/deletePage', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    
  });
})

// #endregion

// #region ForumRoutes

app.post('/api/forum/createCategory', function(req, res) {
  
});

app.delete('/api/forum/deleteCategory', function(req, res) {
  
});

app.put('/api/forum/editCategory', function(req, res) {
  
});

app.post('/api/forum/post', function(req, res) {
  
});

app.post('/api/forum/reply', function(req, res) {
  
});

app.post('/api/forum/editPost', function(req, res) {
  
});

app.post('/api/forum/deletePost', function(req, res) {
  
});

// #endregion

// #region BlogRoutes

app.get('/api/blog/posts/list', function(req, res) {
  BlogPost.find((err, posts) => {
    if(err) {
      console.log(err);
    } else {
      res.json(posts);
    }
  });
});

app.get('/api/blog/posts/get', function(req, res) {
  const id = req.query.id;
  BlogPost.findById(id, (err, post) =>
  {
    if(!post) {
      return res.status(404).json({success: false, statusCode: 404, message: messages.postNotFound});
    } else {
      return res.json({
        name: post.name,
        author: post.author,
        dateCreated: post.date_created,
        comments: post.comments,
        postContents: post.post_contents,
        isLocked: post.is_locked,
        image: post.image
      });
    }
  });
});

app.get('/api/blog/posts/getLatest', function(req, res) {
  const id = req.query.id;
  BlogPost.findById(id, (err, post) =>
  {
    if(!post) {
      return res.status(404).json({success: false, statusCode: 404, message: messages.postNotFound});
    } else {
      return res.json({
        name: post.name,
        author: post.author,
        dateCreated: post.date_created,
        comments: post.comments,
        postContents: post.post_contents,
        isLocked: post.is_locked,
        image: post.image
      });
    }
  });
});

app.post('/api/blog/post', function(req, res) {
  authJwt.verifyToken(req, res, function(req1, res1) {
    socialFeatures.postToBlog(req1, res1, function(req2, res2) {
      res2.status(200).json({success: true, statusCode: 200, message: "Your post was successfully submitted."});
    });
  });
});

app.post('/api/blog/posts/edit', function(req, res) {
  authJwt.verifyToken(req, res, function(req1, res1) {
    socialFeatures.editBlogPost(req1, res1, function(req2, res2) {
      res1.status(200).json({success: true, statusCode: 200, message: "Your post was successfully edited."});
    });
  });
});
// #endregion

// #region MiscellaneousRoutes

app.post('/api/sendReport', function(req, res) {
  authJwt.verifyToken(req, res, function(req, res) {
    accountModule.report(req, res, function(req, res) {
      return res.status(200).json({success: true, statusCode: 200, message: messages.reportSent});
    });
  });
});

app.get('/api/getBannerMessage', function(req, res) {
  globalSettings.retrieveString("noticeBannerBlogPostLink", res, function(key, res, blogPostLink) {
      if(isCurrentDateHoliday(seasonalEvents.ACADIVERSE_ANNIVERSARY)) {

      var acadiverseAge = (globals.ENABLE_DEBUG_MODE && globals.FAKE_CURRENT_DATE) ? globals.FAKE_DATE.getFullYear() - 2025 : new Date().getFullYear() - 2025;

      return res.json(
        {
          showBanner: (acadiverseAge > 0),
          header: messages.acadiverseAnniversaryHeader,
          message: messages.acadiverseAnniversaryMessage.replace("%1", acadiverseAge),
          type: "SITE_EVENT"
        }
      );

    } else {

      if(isCurrentDateHoliday(seasonalEvents.ADVENT)) {

        var currentDay = (globals.ENABLE_DEBUG_MODE && globals.FAKE_CURRENT_DATE)? globals.FAKE_DATE.getDate() : new Date().getDate();
        var daysUntilChristmas = 25 - currentDay;

        return res.json(
          {
            showBanner: true, 
            header: messages.adventHeader, 
            message: messages.adventMessage.replace("%1", daysUntilChristmas),
            type: "SITE_EVENT"
          }
        );

      } else {

        if(isCurrentDateHoliday(seasonalEvents.APRIL_FOOLS)) {

          globalSettings.retrieveString("aprilFoolsHeader", res, function(key, res, aprilFoolsHeader) {
            globalSettings.retrieveString("aprilFoolsMessage", res, function(key, res, aprilFoolsMessage) {
              globalSettings.retrieveString("aprilFoolsBlogPostLink", res, function(req, res, aprilFoolsBlogPostLink) {
                globalSettings.retrieveString("aprilFoolsBannerType", res, function(req, res, aprilFoolsBannerType) {
                  return res.json(
                    {
                      showBanner: showBanner, 
                      header: aprilFoolsHeader, 
                      message: aprilFoolsMessage.replace("%b", aprilFoolsBlogPostLink),
                      type: aprilFoolsBannerType
                    });
                  });
              });
            });
          });
        } else {

          if(isCurrentDateHoliday(seasonalEvents.CHRISTMAS)) {

            return res.json(
              {
                showBanner: true, 
                header: messages.christmasHeader, 
                message: messages.christmasMessage,
                type: "SITE_EVENT"
              });
            
          } else {

            if(isCurrentDateHoliday(seasonalEvents.FOURTH_OF_JULY)) {

              return res.json(
                {
                  showBanner: true, 
                  header: messages.fourthOfJulyHeader, 
                  message: messages.fourthOfJulyMessage,
                  type: "SITE_EVENT"
                });

            } else {

              if(isCurrentDateHoliday(seasonalEvents.HALLOWEEN)) {

                return res.json(
                  {
                    showBanner: true, 
                    header: messages.halloweenHeader, 
                    message: messages.halloweenMessage,
                    type: "SITE_EVENT"
                  });

              } else {

                if(isCurrentDateHoliday(seasonalEvents.NEW_YEARS)) {

                  var year = (globals.ENABLE_DEBUG_MODE && globals.FAKE_CURRENT_DATE) ? globals.FAKE_DATE.getFullYear() : new Date().getFullYear();

                  return res.json(
                    {
                      showBanner: true, 
                      header: messages.newYearsHeader, 
                      message: messages.newYearsMessage.replace("%1", year),
                      type: "SITE_EVENT"
                    });

                } else {

                  if(isCurrentDateHoliday(seasonalEvents.TEACHER_APPRECIATION_WEEK)) {

                    return res.json(
                      {
                        showBanner: true, 
                        header: messages.teacherAppreciationHeader, 
                        message: messages.teacherAppreciationMessage, 
                        type: "SITE_EVENT"
                      });
                    
                  } else {

                    if(isCurrentDateHoliday(seasonalEvents.VALENTINES_DAY)) {

                      return res.json(
                        {
                          showBanner: true, 
                          header: messages.valentineHeader, 
                          message: messages.valentineMessage,
                          type: "SITE_EVENT"
                        }
                      );

                    } else {

                      globalSettings.retrieveBoolean("showBanner", res, function(key, res, showBanner) {
                        globalSettings.retrieveString("noticeBannerHeader", res, function(key, res, header) {
                          globalSettings.retrieveString("noticeBannerMessage", res, function(req, res, message) {
                            globalSettings.retrieveString("noticeBannerType", res, function(req, res, type) {
                              return res.json(
                              {
                                showBanner: showBanner, 
                                header: header, 
                                message: message.replace("%b", blogPostLink),
                                type: type
                              });
                            });
                          });
                        });
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
});

// #endregion

// #region DebugRoutes

//NOTE: The below routes must be removed when the final version of the moderation and appeal code is finished!

app.delete("/api/removeAllAppeals", function(req, res) {
  if(globals.ENABLE_DEBUG_MODE) {
    authJwt.verifyToken(req, res, function(req, res) {
      authJwt.userHasRole(req.headers["username"], "developers", function(username, role, userIsDeveloper) {
        Appeal.deleteMany({}, function(err, res) {
          if(err) {
            console.log(error);
          } else {
            return res.status(200).json({success: true, statusCode: 200, message: "Appeals cleared."});
          }
        });
      });
  });
  } else {
    return res.status(403).json({success: false, statusCode: 403, message: "This route is only available if debug mode has been enabled."});
  }
});

app.delete("/api/clearAllModeratorActions", function(req, res) {
  if(globals.ENABLE_DEBUG_MODE) {
    authJwt.verifyToken(req, res, function(req, res) {
      authJwt.userHasRole(req.headers["username"], "developers", function(username, role, userIsDeveloper) {
        ModeratorAction.deleteMany({}, function(err, res) {
          if(err) {
            console.log(error);
          } else {
            return res.status(200).json({success: true, statusCode: 200, message: "Moderator actions cleared."});
          }
        });
      });
  });
  } else {
    return res.status(403).json({success: false, statusCode: 403, message: "This route is only available if debug mode has been enabled."});
  }
});

// #endregion

app.get("/", function(req, res) {
  return res.json({success: true, statusCode: 200, message: "The Acadiverse API is currently operational."});
});

app.get("/api/", function(req, res) {
  return res.json({success: true, statusCode: 200, message: "For API documentation, please go to acadiverse.com/wiki/api."});
});

app.listen(4000, () => {
    console.log(`${new Date()}: Server is running on port 4000.`);
});