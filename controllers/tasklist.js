const { addNewList, getAllTasks, deleteListById } = require("../services/tasklist");
const { getTasksByList } = require("../services/tasks");

const getAll = async (_, res) => {
  const allLists = await getAllTasks();

  res.send(allLists);
};

const getTasks = async (req, res) => {
  const allLists = await getTasksByList(req.params.id, req.query.all);

  res.send(allLists);
};

const create = async (req, res) => {
  const newList = await addNewList(req.body.title);
  res.status(201).send(newList);
};

const deleteList = async (req, res) => {
  await deleteListById(req.params.id);
  res.send('deleted');
};




module.exports = {
  getAll,
  create,
  deleteList,
  getTasks,
};
