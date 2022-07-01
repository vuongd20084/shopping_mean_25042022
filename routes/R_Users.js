const express = require("express");

const router = express.Router();

//gọi class admin
const C_Admin = require("../class/C_Admin");

router.get("/index", (req, res) => {
  //Sử dụng clas C_Admin

  var use_C_Admin = new C_Admin(req.originalUrl);

  var V_Main = use_C_Admin.get_views("V_Main");
  res.render("admins/V_Index", { V_Main });
});

router.post("/processLogin", function (req, res) {
  //1. Khai bao
  var username = "";
  var password = "";
  var error = "";
  var flag = 1;

  //2. lay du lieu
  username = req.body.username;
  password = req.body.password;

  //3. kiem tra du lieu
  if (username == "") {
    flag = 0;
    error = "Vui lòng nhập Tên đăng nhập";
  }
  if (password == "") {
    flag = 0;
    error = "Vui lòng nhập Mật khẩu";
  }

  //4. Tong ket
  if (flag == 1) {
    res.send({ kp: 1, msg: "login success" });
  } else {
    res.send({ kp: 0, msg: error });
  }
});

module.exports = router;
