'use strict';

const express = require('express');

const app = express;




function handleLogger(req, res, next){
  let now = new Date();
  console.log(now.toLocaleDateString(), req.method, req.url);
  next();
}


module.exports = {handleLogger};