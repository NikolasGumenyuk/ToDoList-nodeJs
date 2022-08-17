const knex = require("../db");
const { getToday } = require("../helpers");

function getAllTasks() {
  return knex.select().table("task");
}

async function getTasksByList(id, params) {
  const tasksByList = await client.query(
    `select * from task where list_id=$1 AND done=false OR (list_id=$1 AND done=$2)`,
    [id, !!params]
  );

  return tasksByList.rows;
}

async function getTaskById(id) {
  const correctTask = await knex.select().from("task").where("task_id", id);

  return correctTask;
} 

async function getDashboardToday() {
  const [todayDay, todayMonth, todayYear] = getToday();
  const dayFrom = new Date([todayYear, todayMonth, todayDay].join('-')).toJSON();
  const dayTo = new Date([todayYear, todayMonth, todayDay + 1].join('-')).toJSON();

  const todayTask = await knex("task")
    .count("due_date")
    .whereBetween("due_date", [dayFrom, dayTo]);

  const todayTaskList = await knex
    .select('tasklist.*')
    .from(function() {
      this.select('list_id').count('list_id as undone')
        .from('task')
        .groupBy('list_id')
        .as('task')
    })
    .rightJoin("tasklist", function() {
      this.on('tasklist.tasklist_id', '=', 'task.list_id')
    }).groupBy('undone');

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
  // const collection = await client.query(
  //   `SELECT task.task_id, task.title, task.done, task.due_date, tasklist.tasklist_id, tasklist.title as "listTitle"
  //  FROM tasklist
  //  JOIN task
  //  ON tasklist.tasklist_id = task.list_id
  //  where task.due_date BETWEEN CURRENT_DATE AND CURRENT_TIMESTAMP`
  // );
  const [todayDay, todayMonth, todayYear] = getToday();
  const dayFrom = new Date([todayYear, todayMonth, todayDay].join('-')).toJSON();
  const dayTo = new Date([todayYear, todayMonth, todayDay + 1].join('-')).toJSON();

  const collection = await knex.select('task.task_id', 'task.title', 'task.done', 'task.due_date', 'tasklist.tasklist_id','tasklist.title as listTitle')
                                .from('tasklist').rightJoin('task', "tasklist.tasklist_id", "task.list_id").whereBetween("task.due_date", [dayFrom, dayTo]);

  const tasksLists = collection.map(
    ({ tasklist_id: id, listTitle: title, ...task }) => ({
      ...task,
      list: { title, id },
    })
  );

  return tasksLists;
}

function addNewTask(task) {
  const newTask = knex
    .insert({
      title: task.title,
      done: task.done,
      due_date: knex.fn.now(),
      list_id: task.list_id,
    })
    .into("task")
    .returning("*");

  return newTask;
}

function deleteTaskById(id) {
  return knex("task").where("task_id", id).del();
}

async function updateTaskById(id, body) {
  const updatedTask = await knex("task")
    .where("task_id", id)
    .update({ title: body.title, done: body.done }, "*");

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
