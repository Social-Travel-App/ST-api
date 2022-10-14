const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./plugins/db");
require("dotenv").config({
  path: "./.env",
});

const PORT = process.env.PORT || 3001;

const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use("/api/v1", require("./api/index"));
app.listen(PORT, () => {
  db();
  console.log("The server listening on port " + PORT);
});
