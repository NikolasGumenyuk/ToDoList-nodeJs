const sequelize = require("../db");
const { Op } = require("sequelize");
const { getToday } = require("../helpers");
const tasks = require("../models/task");
const tasklist = require("../models/tasklist");

function getAllTasks() {
  return tasks.findAll({ raw: true });
}

async function getTasksByList(id, params) {
  const reqToBb = knex("task").where("list_id", id);

  if (!!params !== true) {
    return reqToBb.where("done", false);
  }
  return reqToBb;
}

async function getTaskById(id) {
  const correctTask = tasks.findOne({
    where: { task_id: id },
  });

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
    .select(knex.raw("COUNT(due_date)::INT"))
    .whereBetween("due_date", [dayFrom, dayTo]);

  const todayTaskList = await knex("task")
    .select(
      "tasklist.tasklist_id",
      "tasklist.title",
      knex.raw("COUNT(task.done=false)::INT AS undone")
    )
    .rightJoin("tasklist", function () {
      this.on("task.list_id", "=", "tasklist.tasklist_id");
    })
    .groupBy("tasklist.tasklist_id");

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

  tasks.belongsTo(tasklist, { foreignKey: "list_id" });

  const collection = await tasks.findAll({
    include: tasklist,
    where: { due_date: { [Op.between]: [dayFrom, dayTo] } },
  });

  return collection;
}

function addNewTask(task) {
  const newTask = tasks.create({
    title: task.title,
    description: task.description,
    done: task.done,
    due_date: task.due_date ? task.due_date : undefined, 
    list_id: task.list_id,
  });
  return newTask;
}

function deleteTaskById(id) {
  return tasks.destroy({ where: { task_id: id } });
}

async function updateTaskById(id, body) {
  const updatedTask = tasks.update(
    {
      title: body.title,
      done: body.done,
    },
    { where: { task_id: id }, returning: true }
  );

  return updatedTask;
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
