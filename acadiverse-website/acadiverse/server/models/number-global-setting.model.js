const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//This is a special schema used to store/retrieve the global settings for Acadiverse (i.e. the ones that can be changed by admins).
const NumberGlobalSetting = mongoose.model("number_global_setting", new Schema({
  key: {
    type: String,
    default: ""
  },
  value: {
    type: Number,
    default: 0
  }
 }))
   
module.exports = NumberGlobalSetting;