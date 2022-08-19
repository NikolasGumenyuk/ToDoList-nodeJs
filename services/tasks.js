const knex = require("../db");
const { getToday } = require("../helpers");

function getAllTasks() {
  return knex.select().table("task");
}

async function getTasksByList(id, params) {
  const reqToBb = knex("task").where("list_id", id)

  if (!!params !== true) {
    return reqToBb.where("done", false);
  }
  return reqToBb
}

async function getTaskById(id) {
  const correctTask = await knex.select().from("task").where("task_id", id);

  return correctTask;
}

async function getDashboardToday() {
  const [todayDay, todayMonth, todayYear] = getToday();
  const dayFrom = new Date(
    [todayYear, todayMonth, todayDay].join("-")
  ).toJSON();
  const dayTo = new Date(
    [todayYear, todayMonth, todayDay + 1].join("-")
  ).toJSON();

  const todayTask = await knex("task")
  .select(knex.raw('COUNT(due_date)::INT'))
  .whereBetween("due_date", [dayFrom, dayTo]);
  
    

  const todayTaskList = await knex("task")
    .select("tasklist.tasklist_id", "tasklist.title", knex.raw("COUNT(task.done=false)::INT AS undone")).rightJoin("tasklist", function () {
    this.on("task.list_id", "=", "tasklist.tasklist_id")
  }).groupBy("tasklist.tasklist_id");

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
  const [todayDay, todayMonth, todayYear] = getToday();
  const dayFrom = new Date(
    [todayYear, todayMonth, todayDay].join("-")
  ).toJSON();
  const dayTo = new Date(
    [todayYear, todayMonth, todayDay + 1].join("-")
  ).toJSON();

  const collection = await knex
    .select(
      "task.task_id",
      "task.title",
      "task.done",
      "task.due_date",
      "tasklist.tasklist_id",
      "tasklist.title as listTitle"
    )
    .from("tasklist")
    .rightJoin("task", "tasklist.tasklist_id", "task.list_id")
    .whereBetween("task.due_date", [dayFrom, dayTo]);

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
