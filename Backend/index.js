const express = require("express");
require("./db/mongoose.js");
const usersRoute = require("./Routers/users.js");
const BrandsRoute = require("./Routers/brands.js");
const cuisinesRoute = require("./Routers/cuisines.js");
const dishesRoute = require("./Routers/dishes.js");
const reviewsRoute = require('./Routers/reviews.js');
const expError = require("./utils/expError.js");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(usersRoute);
app.use(BrandsRoute);
app.use(cuisinesRoute);
app.use(dishesRoute);
app.use(reviewsRoute);

app.all("*", (req, res, next) => {
  next(new expError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 400, message = "Something Went Wrong" } = err;
  res.status(statusCode).json(message);
});

app.listen(port, function () {
  console.log("Server is up on port " + port);
});
