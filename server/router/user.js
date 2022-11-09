const express = require("express");
const router = express.Router();

const db = require("../config/dbConn");

router.get("/api/user", (req, res) => {
    const username = req.user
    if (!username) {
        return res.status(400).json({ message: "Username is required." });
    }
    db.query("select * from user where username = ?", [username], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            res.json(result);
        }
    });
})

module.exports = router