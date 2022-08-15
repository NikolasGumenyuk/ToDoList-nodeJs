const express = require("express");
const router = express.Router();

const tasks = require("./tasks");
const tasklist = require("./tasklist");

router.use("/task", tasks);
router.use("/tasklist", tasklist);

module.exports = router;
