const express = require("express");
const router = express.Router();

const db = require("../config/dbConn");

router.get("/api/pid", (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    db.query(
        "select user_id from user where refresh_token = ?",
        [refreshToken],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.length === 0) {
                    return res.sendStatus(403); // No user with the refresh token found
                }

                const uid = result[0].user_id 

                db.query(
                    "select pid from portfolio where uid = ?",
                    [uid],
                    (err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(result)
                            res.send({ pid_1: result[0]?.pid, pid_2: result[1]?.pid })
                        }
                    }
                )
            }
        }
    )
})

module.exports = router