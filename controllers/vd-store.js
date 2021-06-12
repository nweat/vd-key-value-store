const Store = require('../models/Store')

const welcome = (req, res, next) => {
  res.json({message: "Welcome to Vault's Dragon Internal Key Store API interface"});
};

/**
 * @description Add given key/value pair to the store
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns application/json
 * @sampleresponse {"key":"mykey", "value":"value1", "timestamp": 1623462342}
 */
const addToStore = async (req, res, next) => {
  try {
    const body = req.body
    const key = Object.keys(body)[0]
    const value = body[key]
    const options = { upsert: true, new: true, useFindAndModify: false }
    
    Store.findOneAndUpdate({ key }, { $set: { key, value, timestamp : Date.now() } }, options, async (err, doc) => {
      if(err) {
        return res.status(500).json({error: err})
      }
      doc.history.push({value: value, timestamp: doc.timestamp})
      await doc.save()
      const updatedAt = Math.floor(new Date(doc.timestamp) / 1000)
      return res.json({key: doc.key, value: doc.value, timestamp: updatedAt})
    })
  } catch (err) {
    return res.status(500).send(err)
  }
};

/**
 * @description Latest value associated to the given :key
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns application/json
 * @sampleresponse { "value": "value1" }
 * 
 */
const findByKey = (req, res, next) => {
  try {
    const key = req.params.key

    Store.findOne({ key: key }, (err, doc) => {
      if(err) {
        return res.status(500).json({error: err})
      }

      if(doc == null) {
        return res.json({error: "key not found in store"})
      }

      return res.json({value: doc.value})
    })
  } catch (err) {
    return res.status(500).send(err)
  }
}

/**
 * 
* @description Latest value associated to the given :key and :timestamp. The key/value pair selected is based on the time 
closest to the given :timestamp 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns application/json
 * @sampleresponse { "value": "value1" }
 */
const findByKeyAndTimeStamp = (req, res, next) => {
  try {
    Store.aggregate([
      {$match: {key: req.params.key}},
      { $unwind: "$history" },
      {
          $project : {
            "history.value" : 1,
            "history.timestamp" : 1,
              difference : {
                  $abs : {
                      $subtract : [new Date(parseInt(req.params.timestamp) * 1000), "$history.timestamp"]
                  }
              }
          }
      },
      {
          $sort : {difference : 1}
      },
      {
          $limit : 1
      }], ((err, doc) => {

        if(err) {
          return res.status(500).json({error: err})
        }

        if(doc.length === 0) {
          return res.json({error: "cannot find key/value pair based on given condition"})
        }

        if(doc) {
          return res.json({value: doc[0].history.value})
        }
  
      }))
  } catch (err) {
    return res.status(500).send(err)
  }
}


module.exports = {
  addToStore,
  findByKey,
  findByKeyAndTimeStamp,
  welcome
};