const sequelize = require("../db");
const tasklist = require("../models/tasklist");

async function getAllTasks() {
  const allLists = tasklist.findAll({ raw: true });

  return allLists;
}

async function getListById(id) {
  const [list] = tasklist.findOne({  where: { tasklist_id: id } });

  return list;
}

async function addNewList(title) {

  const newList = tasklist.create({ title: title });

  return newList;
}

async function deleteListById(id) {
  return tasklist.destroy({ where: { tasklist_id: id } });
}

module.exports = { getAllTasks, addNewList, getListById, deleteListById };
