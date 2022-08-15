const router = require("express").Router();
const task = require("../controllers/TasksController");

router.get('/', task.getAll);
router.get('/dashboard', task.getDashboard)
router.get('/collection/today', task.getCollection)
router.post('/', task.create);
router.delete('/:id', task.deleteTask);
router.patch('/:id', task.updateTask);

module.exports = router;
