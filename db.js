// require('dotenv').config()
// const { Client } = require('pg');
// const client = new Client()
const knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password : 'adehas53',
    database : 'todolist'
  }
});

knex.raw("SELECT 1").then(() => {
  console.log("PostgreSQL connected");
})
.catch((e) => {
  console.log("PostgreSQL not connected");
  console.error(e);
});


module.exports = knex;
