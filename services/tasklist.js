const client = require("../db");

async function getAllTasks() {
  const allLists = await client.query("select * from tasklist");

  return allLists.rows;
}

async function getListById(id) {
  const [list] = await (await client.query(`select * from tasklist where tasklist_id=$1`, [id])).rows;

  return list;
}

async function addNewList(title) {
  const newList = await client.query(
    `insert into tasklist (title) values ($1) RETURNING *`, [title]
  );

  return newList.rows[0];
}

async function deleteListById(id) {
  return client.query(`DELETE FROM tasklist WHERE tasklist_id=$1`, [id])
}

module.exports = { getAllTasks, addNewList, getListById, deleteListById };
