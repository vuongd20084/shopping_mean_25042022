const express = require("express");
const app = express();
const port = 3000;

//Đường dẫn tĩnh
app.use(express.static("public"));

//ejs
app.set("view engine", "ejs");

//Gọi Database
require('./configs/database')

//bodyParser
var bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Call control
app.use("/", require("./configs/controls"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
