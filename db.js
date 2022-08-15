require('dotenv').config()
const { Client } = require('pg');
const client = new Client()

client.connect()

module.exports = {query: (text, params) => client.query(text, params),}
