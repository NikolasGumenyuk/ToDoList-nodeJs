const express = require("express");
const app = express();
const cors = require('cors');
const router = require('./routes')


function logRequest({ method, url }, res, next) {
  console.log(`[${new Date().toISOString()}] ${method} ${url}`);
  next();
}

app.use(express.json());
app.use(logRequest);
app.use(cors());
app.use(router)

 module.exports = app