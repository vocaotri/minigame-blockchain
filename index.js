const { urlencoded } = require("express");
let express = require("express");
let app = express();
require("dotenv").config();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(urlencoded({ extended: false }));
app.use(
  "/scripts",
  express.static(__dirname + "/node_modules/web3.js-browser/build/")
);
let server = require("http").Server(app);
let io = require("socket.io")(server);
server.listen(3000);
let abi = [
  /** Your abi */
];

const mongoose = require("mongoose");
mongoose.connect(
  process.env.URL_DB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) throw "Connect fail" + err;
    console.log("connect success");
  }
);

require("./controllers/game")(app, abi, io);
