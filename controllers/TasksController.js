const { getListById } = require("../services/tasklist");
const {
  addNewTask,
  getAllTasks,
  deleteTaskById,
  updateTaskById,
  getDashboardToday,
  getTaskById,
  getCollectionToday,
} = require("../services/tasks");

const getAll = async (_, res) => {
  const allLists = await getAllTasks();

  res.send(allLists);
};

const getDashboard = async (_, res) => {
  const dashboard = await getDashboardToday();

  res.send(dashboard);
};

const getCollection = async(_, res) => {
  const collection = await getCollectionToday();

  res.send(collection)
}
 
const create = async (req, res) => {
  // const list = await getListById(req.body.list_id);

  // if (!list) {
  //   res.status(400).send("Bad Request: List doesn't exist");
  //   return;
  // }

  const newTask = await addNewTask(req.body);

  res.status(201).send(newTask);
};

const deleteTask = async (req, res) => {
  await deleteTaskById(req.params.id);

  res.send("deleted");
};

const updateTask = async (req, res) => {
  const { params, body } = req;
  const { id } = params;

  const correctTask = await getTaskById(id);

  if (!correctTask) {
    res.status(400).send("Bad Request: Task doesn't exist");
    return;
  }

  const taskToUpdate = {
    ...correctTask,
    ...body,
  };

  const updatedTask = await updateTaskById(id, taskToUpdate);

  res.send(updatedTask);
};

module.exports = {
  getAll,
  deleteTask,
  create,
  updateTask,
  getDashboard,
  getCollection,
};
