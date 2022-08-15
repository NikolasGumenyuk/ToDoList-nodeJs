const router = require("express").Router();
const tasklist = require("../controllers/tasklist");

router.get('/', tasklist.getAll);
router.post('/', tasklist.create);
router.delete('/:id', tasklist.deleteList);
router.get('/:id/tasks', tasklist.getTasks);

module.exports = router;
