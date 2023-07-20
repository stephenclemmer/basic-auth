"use strict";

require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const userSchema = require("./users-model");

/* This line of code is setting the value of the `DATABASE_URL` constant based on the value of the
`NODE_ENV` environment variable. */
const DATABASE_URL =
  process.env.NODE_ENV === "test" ? "sqlite::memory" : process.env.DATABASE_URL;

const sequelizeDatabase = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const UsersModel = userSchema(sequelizeDatabase, DataTypes);

module.exports = { sequelizeDatabase, UsersModel };
