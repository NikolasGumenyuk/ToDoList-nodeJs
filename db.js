const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("todolist", "todolist_app", "todolist", {
  dialect: "postgres",
});

try {
  sequelize.authenticate();
  console.log("Connected to database");
} catch (e) {
  console.log("Connection failed: ", e);
}

module.exports = sequelize;
