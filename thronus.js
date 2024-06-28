var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
var expressLayouts = require("express-ejs-layouts");
let flash = require('express-flash')
var session = require("express-session");
const basemiddleware = require("./helper/basemiddleware");
const fileUpload = require("express-fileupload");
const db = require("./config/config");
var subadminRouter = require("./routes/subadmin");
var adminRouter = require("./routes/admin");
var apiRouter = require("./routes/api");
require("dotenv").config();

var csv = require('csvtojson');
var app = express();
const http = require('http').createServer(app);

db();
app.use(fileUpload());


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "./layout/abc.ejs");
app.set("view engine", "ejs");

app.set("trust proxy", 1);
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 365 * 1000,
    },
  })
);
app.use(flash());

app.use(basemiddleware);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/subadmin", subadminRouter);
app.use("/admin", adminRouter);
app.use("/api",apiRouter);


// main().catch(err => console.log(err));

// async function main() {
//   console.log("db connected")
//   await mongoose.connect(process.env.URI);

//   // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
// }

const io = require('socket.io')(http);
var socket = require('./socket')(io);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const PORT = process.env.PORT || 4060

http.listen(PORT, () => {
  console.log(`server listening on ${PORT}`)
});

module.exports = app;
