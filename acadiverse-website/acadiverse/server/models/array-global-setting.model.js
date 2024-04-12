const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//This is a special schema used to store/retrieve the global settings for Acadiverse (i.e. the ones that can be changed by admins).
const ArrayGlobalSetting = mongoose.model("array_global_setting", new Schema({
  key: {
    type: String,
    default: ""
  },
  value: {
    type: Array,
    default: []
  }
 }))
   
module.exports = ArrayGlobalSetting;