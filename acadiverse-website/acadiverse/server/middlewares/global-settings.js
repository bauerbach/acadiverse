/**
 * @file Methods for managing global settings (settings that can only be changed by admins).
 * @author Bradley Auerbach <bauerbach@gmail.com>
 * @version 1.0.0
 */

const db = require("../models");
const mongoose = require('mongoose');
const BooleanGlobalSetting = require('../models/boolean-global-setting.model');
const NumberGlobalSetting = require('../models/number-global-setting.model');
const StringGlobalSetting = require('../models/string-global-setting.model');
const ArrayGlobalSetting = require('../models/array-global-setting.model');
const messages = require("../config/messages");


retrieveBoolean = (key, res, next) => {
    BooleanGlobalSetting.findOne({key: key}).then(setting => {
        if(!setting) {
          return res.status(404).json({success: false, statusCode: 404, message: messages.invalidKey.replace("%1", key)});
        }
        next(key, res, setting.value);
      });
}

retrieveNumber = (key, res, next) => {
    NumberGlobalSetting.findOne({key: key}).then(setting => {
        if(!setting) {
          return res.status(404).json({success: false, statusCode: 404, message: messages.invalidKey.replace("%1", key)});
        }
        next(key, res, setting.value);
      });
}

retrieveString = (key, res, next) => {
    StringGlobalSetting.findOne({key: key}).then(setting => {
        if(!setting) {
          return res.status(404).json({success: false, statusCode: 404, message: messages.invalidKey.replace("%1", key)});
        }
        next(key, res, setting.value);
      });
}

retrieveAllArrayElements = (key, res, next) => {
    ArrayGlobalSetting.findOne({key: key}).then(setting => {
        if(!setting) {
          return res.status(404).json({success: false, statusCode: 404, message: messages.invalidKey.replace("%1", key)});
        }
        next(key, res, setting.value);
      });
}

retrieveArrayElement = (key, index, res, next) => {
    ArrayGlobalSetting.findOne({key: key}).then(setting => {
        if(!setting) {
          return res.status(404).json({success: false, statusCode: 404, message: messages.invalidKey.replace("%1", key)});
        }
        next(key, index, res, setting.value[index]);
      });
}

isValueInArray = (key, value, res, next) => {
    ArrayGlobalSetting.findOne({key: key}).then(setting => {
        if(!setting) {
          return res.status(404).json({success: false, statusCode: 404, message: messages.invalidKey.replace("%1", key)});
        }
        var elementInArray = false;
        if(setting.value.includes(value)) {
            elementInArray = true;
        }
        next(key, value, res, elementInArray);
      });
}

setBoolean = (key, value, res, next) => {
    var settingQuery = { key: key }
    var newData = { $set: {value: value} }
    BooleanGlobalSetting.updateOne(settingQuery, newData, function(err) {
        if (err) {
            return res.json({err: err});
        }
        next(key, value, res);
    });
}

setNumber = (key, value, res, next) => {
    if(isNaN(value)) {
        return res.status(400).json({success: false, statusCode: 400, message: "The provided value is not a number."});
    }
    var settingQuery = { key: key }
    var newData = { $set: {value: value} }
    NumberGlobalSetting.updateOne(settingQuery, newData, function(err) {
        if (err) {
            return res.json({err: err});
        }
        next(key, value, res);
    });
}

setString = (key, value, res, next) => {
    var settingQuery = { key: key }
    var newData = { $set: {value: value} }
    StringGlobalSetting.updateOne(settingQuery, newData, function(err) {
        if (err) {
            return res.json({err: err});
        }
        next(key, value, res);
    });
}

addToArray = (key, value, res, next) => {
    var settingQuery = { key: key }
    var newData = { $push: {value: value} }
    ArrayGlobalSetting.updateOne(settingQuery, newData, function(err) {
        if (err) {
            return res.json({err: err});
        }
        next(key, value, res);
    });
}

removeFromArray = (key, value, res, next) => {
    var settingQuery = { key: key }
    var newData = { $pull: {value: value} }
    ArrayGlobalSetting.updateOne(settingQuery, newData, function(err) {
        if (err) {
            return res.json({err: err});
        }
        next(key, value, res);
    });
}

clearArray = (key, value, res, next) => {
    var settingQuery = { key: key }
    var newData = { $set: {value: []} }
    ArrayGlobalSetting.updateOne(settingQuery, newData, function(err) {
        if (err) {
            return res.json({err: err});
        }
        next(key, value, res);
    });
}

checkBoolean = (key, defaultValue) => {
    BooleanGlobalSetting.findOne({key: key}).then(setting => {
        if(!setting) {
            BooleanGlobalSetting.create({key: key, value: defaultValue});
            console.log(`${new Date()}: Global setting ${key} was not found! Setting added to database and set to default value.`);
        }
    });
}

checkNumber = (key, defaultValue) => {
    NumberGlobalSetting.findOne({key: key}).then(setting => {
        if(!setting) {
            NumberGlobalSetting.create({key: key, value: defaultValue});
            console.log(`${new Date()}: Global setting ${key} was not found! Setting added to database and set to default value.`);
        }
    });
}

checkString = (key, defaultValue) => {
    StringGlobalSetting.findOne({key: key}).then(setting => {
        if(!setting) {
            StringGlobalSetting.create({key: key, value: defaultValue});
            console.log(`${new Date()}: Global setting ${key} was not found! Setting added to database and set to default value.`);
        }
    });
}

checkArray = (key) => {
    ArrayGlobalSetting.findOne({key: key}).then(setting => {
        if(!setting) {
            ArrayGlobalSetting.create({key: key, value: []});
            console.log(`${new Date()}: Global setting ${key} was not found! Setting added to database and set to default value.`);
        }
    });
}

const globalSettings = {
    retrieveBoolean,
    retrieveNumber,
    retrieveString,
    retrieveAllArrayElements,
    retrieveArrayElement,
    isValueInArray,
    setBoolean,
    setNumber,
    setString,
    addToArray,
    removeFromArray,
    clearArray,
    checkBoolean,
    checkNumber,
    checkString,
    checkArray
};

module.exports = globalSettings;