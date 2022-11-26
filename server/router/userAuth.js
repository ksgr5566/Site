const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const db = require("../config/dbConn");

require("dotenv").config();
// Access and refresh tokens are generated using:
// require('crypto').randomBytes(64).toString('hex')

// registering new user
router.post("/api/user/register", (req, res) => {
  const { username, password, firstname, lastname } = req.body;
  if (!username || !password || !firstname || !lastname) {
    return res
      .status(400)
      .json({
        message: "Username, password, firstname, and lastname are required.",
      });
  }

  db.query(
    "select * from user where username = ?",
    [username],
    async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result.length === 0) {
          const pwd = await bcrypt.hash(password, 10);
          db.query(
            "call insert_user (?,?,?,?)",
            [firstname, lastname, username, pwd],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                console.log(result);
                return res
                  .status(201)
                  .json({ success: `New user ${username} created!` });
              }
            }
          );
        } else {
          return res.sendStatus(409);
        }
      }
    }
  );
});

// handle user login
router.put("/api/user/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }
    
    db.query(
        "select * from user where username = ?",
        [username],
        async (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.length === 0) {
                    return res.status(404).json({ message: `User ${username} not found.` });
                } else {
                    const match = await bcrypt.compare(password, result[0].password);
                    if (match) {
                        // create JWTs
                        const accessToken = jwt.sign(
                            {
                                "UserInfo": {
                                    "username": username,
                                },
                            },
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: "10s" }
                        );
                        
                        const refreshToken = jwt.sign(
                            { "username": username },
                            process.env.REFRESH_TOKEN_SECRET,
                            { expiresIn: "1d" }
                        );

                        // Saving refreshToken with current user
                        db.query(
                            "update user set refresh_token = ? where username = ?",
                            [refreshToken, username],
                            (err, result) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(result);
                                }
                            }
                        )

                        // Creates Secure Cookie with refresh token
                        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // secure: true, sameSite: 'None',

                        // Send authorization roles and access token to user
                        return res.status(200).json({ accessToken: accessToken });
                    } else {
                        return res.status(401).json({ message: "Invalid password." });
                    }
                }
            }
        }
    );
});

// refresh token
router.get("/api/user/refresh", (req, res) => {
    const cookies = req.cookies;
    console.log(cookies)

    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    db.query(
        "select * from user where refresh_token = ?",
        [refreshToken],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.length === 0) {
                    return res.sendStatus(403); //Forbidden 
                } else {
                    jwt.verify(
                        refreshToken,
                        process.env.REFRESH_TOKEN_SECRET,
                        (err, decoded) => {
                            if (err || result[0].username !== decoded.username) return res.sendStatus(403);
                            const accessToken = jwt.sign(
                                {
                                    "UserInfo": {
                                        "username": decoded.username,
                                    }
                                },
                                process.env.ACCESS_TOKEN_SECRET,
                                { expiresIn: '10s' }
                            );
                            res.json({ accessToken, username: decoded.username })
                        }
                    );
                }
            }
        }
    )
})

// handle user logout
router.put("/api/user/logout", (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    db.query(
        "select * from user where refresh_token = ?",
        [refreshToken],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.length === 0) {
                    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                    return res.sendStatus(204);
                } else {
                    // Delete refreshToken from db
                    db.query(
                        "update user set refresh_token = null where refresh_token = ?",
                        [refreshToken],
                        (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(result);
                                // Delete cookie
                                res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                                return res.sendStatus(204);
                            }
                        }
                    );
                }
            }
        }
    )
})

module.exports = router;
