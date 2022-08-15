const client = require("../db");

function getAllTasks() {
  return client.query("select * from task").then((data) => data.rows);
}
function getTasksByList(id) {
  return client
    .query(`select * from task where list_id=$1`, [id])
    .then((data) => data.rows);
}

async function getTaskById(id) {
  const correctTask = await client.query(
    `select * from task where task_id=$1`,
    [id]
  );

  return correctTask.rows[0];
}

async function getDashboardToday() {
  const todayTask = await (
    await client.query(
      `SELECT COUNT(due_date) from task where due_date BETWEEN CURRENT_DATE AND CURRENT_TIMESTAMP`
    )
  ).rows;

  const todayTaskList = await (
    await client.query(
      `SELECT tasklist.tasklist_id, tasklist.title, task.undone
      FROM (SELECT task.list_id, COUNT(*) AS "undone" FROM task WHERE done=false group by list_id) as task
      RIGHT JOIN tasklist
      ON tasklist.tasklist_id = task.list_id`
    )
  ).rows;

  const [todayTaskRes, lists] = await Promise.all([
    todayTask[0],
    todayTaskList,
  ]);

  return {
    ...todayTaskRes,
    lists,
  };
}

async function getCollectionToday() {
  const collection = await client.query(
  `SELECT task.task_id, task.title, task.done, task.due_date, tasklist.list
   FROM (SELECT tasklist.tasklist_id, tasklist.title AS "list" FROM tasklist group by tasklist_id) as tasklist
   RIGHT JOIN task
   ON tasklist.tasklist_id = task.list_id
   where task.due_date BETWEEN CURRENT_DATE AND CURRENT_TIMESTAMP`
   );

  return collection.rows;
}

async function addNewTask(task) {
  const newTask = await client.query(
    `insert into task (title, done, due_date, list_id) values ($1, $3, CURRENT_TIMESTAMP, $2)  RETURNING *`,
    [task.title, task.list_id, task.done]
  );

  return newTask.rows;
}

function deleteTaskById(id) {
  return client.query(`DELETE FROM task WHERE task_id='$1'`, [id]);
}

async function updateTaskById(id, body) {
  const updatedTask = await client.query(
    `UPDATE task SET title = $1, done = $2, due_date = CURRENT_TIMESTAMP WHERE task_id=$3 RETURNING *`,
    [body.title, body.done, id]
  );

  return updatedTask.rows;
}

module.exports = {
  getAllTasks,
  addNewTask,
  deleteTaskById,
  getTasksByList,
  updateTaskById,
  getDashboardToday,
  getTaskById,
  getCollectionToday,
};
