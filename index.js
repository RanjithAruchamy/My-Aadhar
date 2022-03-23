const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const router = require("./Routes/router");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use("/api", router);
app.use("/", express.static(path.join(__dirname, "./Frontend")));
mongoose.connect(
  "mongodb+srv://adminUser:Admin123@ranjithcluster.jkhq5.mongodb.net/aadhar?retryWrites=true&w=majority",
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log("DB connected")
);
app.listen(8000, () => console.log(`Server is UP @8000`));
