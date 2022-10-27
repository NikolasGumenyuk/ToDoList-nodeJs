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
  const todayTask = await await sequelize.query(
    `SELECT COUNT(due_date) as today from task where due_date BETWEEN CURRENT_DATE AND CURRENT_TIMESTAMP`
  );

  const todayTaskList = await await sequelize.query(
    `SELECT tasklist.tasklist_id, tasklist.title, task.undone
    FROM (SELECT task.list_id, COUNT(*) AS "undone" FROM task WHERE done=false group by list_id) as task
    RIGHT JOIN tasklist
    ON tasklist.tasklist_id = task.list_id`
  );

  const [todayTaskRes, lists] = await Promise.all([
    todayTask[0],
    todayTaskList[0],
  ]);

  return {
    ...todayTaskRes[0],
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
    where: { due_date: { [Op.lte]: dayTo } },
    order: [["due_date", "ASC"]],
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
      description: body.description,
      done: body.done,
      due_date: body.due_date,
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
