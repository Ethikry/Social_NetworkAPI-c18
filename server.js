const express = require("express");
const db = require("./config/connection.js");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("./routes"));

app.listen(PORT, () =>
  console.log(`Connected to server running on localhost:${PORT}`)
);
