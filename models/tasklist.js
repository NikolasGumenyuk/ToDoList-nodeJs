const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");

const tasklist = sequelize.define(
  "tasklist",
  {
    tasklist_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING },
  },
  {
    tableName: "tasklist",
    timestamps: true,
    createdAt: false,
    updatedAt: false,
  }
);

async () => {
  await sequelize.sync({ force: true });
  console.log("All models were synchronized successfully.");
};

module.exports = tasklist;
