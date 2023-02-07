"use strict"

const response = require('../utils/response');
module.exports.handle = async (_) => {

   return response(200, { message: "A simple get" })
};