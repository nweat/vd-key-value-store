const mongoose = require("mongoose")
const { Schema } = mongoose

const historySchema = new Schema({ value: String, timestamp: Date });

const storeSchema = new Schema({
  key: String,
  value: String,
  timestamp: Date,
  history: [historySchema]
})

const store = mongoose.model("store", storeSchema)
module.exports = store