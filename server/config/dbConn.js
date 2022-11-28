const mysql = require('mysql');

require("dotenv").config();

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: process.env.PASSWORD,
    database: "sitedb",
});

module.exports = db