const express = require("express");
const app = express();
const session = require("express-session");
const port = 6969;
const route = require("./routes/route");

// const multer = require('multer')
// const upload = multer({ dest: 'assets/' })

// view engine setup using ejs
app.set("view engine", "ejs");

// untuk menerima data dari form
app.use(express.urlencoded({ extended: false }));

// setup express session
app.use(
  session({
    secret: "cuitter",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: true,
    },
  })
);
      
// routing
app.use(route);

app.listen(port, () => {
  console.log(`CUITTER app listening on port ${port}`);
});
