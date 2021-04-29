const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
// var bodyParser = require("body-parser");
// const test = require("./client/build");

require("dotenv").config();

const app = express();
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );
// app.use(bodyParser.json());

app.use(express.json());
app.use(cors());
// app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3009;

// import routes
const router = require("./backend/routes/route");
// const { config } = require("dotenv");
app.use("/api", router);

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "./client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build", "index.html"));
  });
}

// connect mongo start
const uri = process.env.MONGO_URL;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

mongoose.connect(uri, options);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Mongo Connected");
});

app.listen(PORT, () => {
  console.log("Port is connected at ", PORT);
});
