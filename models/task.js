const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");

const tasks = sequelize.define(
  "tasks",
  {
    task_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    done: {
      type: DataTypes.BOOLEAN,
    },
    due_date: {
      type: DataTypes.DATE,
    },
    list_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "task",
    timestamps: true,
    createdAt: false,
    updatedAt: false,
  }
);

async () => {
  await sequelize.sync({ force: true });
  console.log("All models were synchronized successfully.");
};

module.exports = tasks;
