"use strict"

const response = require('../response');
module.exports.handle = async (_) => {

   return response(201, { message: "get" })
};