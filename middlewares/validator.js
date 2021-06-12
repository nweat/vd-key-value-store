const validatePOSTBody = function (req, res, next) {
    const error = 'Expecting 1 key/value pair. Sample input: {"key": "value"}'

    if(!req.body) {
        return res.status(400).send({error})
    }

    if(Object.keys(req.body).length < 1 || Object.keys(req.body).length > 1) {
        return res.status(400).send({error})
    }
    
    next()
}

const validateGETBody = function (req, res, next) {
    const isValid = new Date(parseInt(req.params.timestamp)).getTime() > 0;
    const error = 'Please provide a valid UNIX timestamp. Sample: 1623479604'

    if(!req.params.timestamp) {
        return res.status(400).send({error: "Timestamp parameter is missing"})
    }
    
    if(isValid <= 0) {
        return res.status(400).send({error})
    }
    
    next()
}

module.exports = {
    validatePOSTBody,
    validateGETBody
}