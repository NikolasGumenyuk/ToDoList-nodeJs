const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("postgres", "postgres", "adehas53", {
  dialect: "postgres",
});

try {
  sequelize.authenticate();
  console.log("Connected to database");
} catch (e) {
  console.log("Connection failed: ", e);
}

module.exports = sequelize;
