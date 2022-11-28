"use strict"

const response = require('../response');
module.exports.handle = async (_) => {

   return response(200, { message: "A simple get" })
};