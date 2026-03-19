const express = require("express");
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const categoriesRouter = require("./routes/categoriesRouter");
const developersRouter = require("./routes/developersRouter");
const gamesRouter = require("./routes/gamesRouter");

require("dotenv").config();

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const assetPath = path.join(__dirname, "public");
app.use(express.static(assetPath));

app.use("/", indexRouter);
app.use("/categories", categoriesRouter);
app.use("/developers", developersRouter);
app.use("/games", gamesRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log("server started on port " + PORT);
});
