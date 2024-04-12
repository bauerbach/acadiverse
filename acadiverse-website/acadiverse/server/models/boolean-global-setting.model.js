const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//This is a special schema used to store/retrieve the global settings for Acadiverse (i.e. the ones that can be changed by admins).
const BooleanGlobalSetting = mongoose.model("boolean_global_setting", new Schema({
    key: {
      type: String,
      default: ""
    },
    value: {
      type: Boolean,
      default: false
    }
   }))
   
module.exports = BooleanGlobalSetting;