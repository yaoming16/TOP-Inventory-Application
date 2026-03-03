const express = require("express");
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const categoriesRouter = require("./routes/categoriesRouter");

require('dotenv').config();


const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const assetPath = path.join(__dirname, "public");
app.use(express.static(assetPath));

app.use("/", indexRouter);
app.use("/categories", categoriesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log("server started on port " + PORT);
});