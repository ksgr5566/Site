const express = require("express");
const router = express.Router();

const db = require("../config/dbConn");

router.get("/api/users", (req, res) => {
    console.log(req)
    db.query("select * from user", (err, result) => {
        if (err) {
        console.log(err);
        } else {
            console.log(result)
        res.json(result);
        }
    });
})

module.exports = router