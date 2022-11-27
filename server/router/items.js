const express = require("express");
const router = express.Router();

const db = require("../config/dbConn");

router.post("/api/item", (req, res) => {
    const { ticker, quantity, value, currency, conversionRate, pid } = req.body
    const cookies = req.cookies
    if (!cookies?.jwt) {
        return res.sendStatus(204); //No content
    }
    
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
                            const pid_1 = result[0]?.pid
                            const pid_2 = result[1]?.pid
                            
                            if (pid !== pid_1 && pid !== pid_2) {
                                return res.sendStatus(403)
                            } 
                            
                            db.query(
                                "call insert_item (?,?,?,?,?,?)",
                                [ticker, quantity, value, currency, conversionRate, pid],
                                (err, result) => {
                                    if (err) {
                                    console.log(err);
                                    } else {
                                        console.log(result);
                                        return res.sendStatus(201)
                                    }
                                }
                            );
                        }
                    }
                )
            }
        }
    )
})

router.get("/api/items", (req, res) => {
    const pid = req.query.pid

    const cookies = req.cookies
    if (!cookies?.jwt) {
        return res.sendStatus(204); //No content
    }
    
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
                            const pid_1 = result[0]?.pid
                            const pid_2 = result[1]?.pid
                            
                            if (pid != pid_1 && pid != pid_2) {
                                return res.sendStatus(403)
                            } 

                            db.query(
                                "select ticker, sum(quantity) as quantity, sum(value) as value from items where pid=? group by ticker;",
                                [pid],
                                (err, result) => {
                                    if (err) {
                                    console.log(err);
                                    } else {
                                        console.log(result);
                                        return res.json(result)
                                    }
                                }
                            );
                        }
                    }
                )
            }
        }
    )

})

router.get("/api/items/sellquantity", (req, res) => {
    const pid = req.query.pid
    const ticker = req.query.ticker

    const cookies = req.cookies
    if (!cookies?.jwt) {
        return res.sendStatus(204); //No content
    }
    
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
                            const pid_1 = result[0]?.pid
                            const pid_2 = result[1]?.pid
                            
                            if (pid != pid_1 && pid != pid_2) {
                                return res.sendStatus(403)
                            }

                            db.query(
                                "select sum(quantity) as quantity from items where pid=? and ticker=? and quantity < 0;",
                                [pid, ticker],
                                (err, result) => {
                                    if (err) {
                                    console.log(err);
                                    } else {
                                        console.log(result);
                                        return res.json(result)
                                    }
                                }
                            );
                        }
                    }
                )
            }
        }
    )

})

router.get("/api/items/buyorders", (req, res) => {
    const pid = req.query.pid
    const ticker = req.query.ticker

    const cookies = req.cookies
    if (!cookies?.jwt) {
        return res.sendStatus(204); //No content
    }
    
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
                            const pid_1 = result[0]?.pid
                            const pid_2 = result[1]?.pid
                            
                            if (pid != pid_1 && pid != pid_2) {
                                return res.sendStatus(403)
                            } 

                            db.query(
                                "select quantity, value from items where pid=? and ticker=? and quantity > 0;",
                                [pid, ticker],
                                (err, result) => {
                                    if (err) {
                                    console.log(err);
                                    } else {
                                        console.log(result);
                                        return res.json(result)
                                    }
                                }
                            );
                        }
                    }
                )
            }
        }
    )

})

module.exports = router