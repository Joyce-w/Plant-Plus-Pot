const express = require('express');
const cors = require("cors");
const { NotFoundError } = require("./ExpressError")

//Import routes file that you will be using
const plantRoutes = require("./routes/plants")

const morgan = require("morgan");
const app = express();

//add middleware 

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: false }));

app.use("/plants", plantRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  return next(new NotFoundError());
});

// error handler
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
