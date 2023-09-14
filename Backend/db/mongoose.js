const mongoose = require("mongoose");
require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL;

mongoose.set("strictQuery", false);

mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});