require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3500;

const verifyJWT = require('./middleware/verifyJWT');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.use(require('./router/userAuth'))

app.use(verifyJWT)

app.use(require('./router/trial'))

app.listen(PORT, () => {
  console.log(`Your server is running on port: ${PORT}`);
});
