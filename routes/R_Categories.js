const express = require("express");

const router = express.Router();

//gọi class admin
const C_Admin = require("../class/C_Admin");
//gọi class html
const C_Html = require("../class/C_Html");
//gọi class Categories
const C_Categories = require("../class/C_Categories");

//Call models
const categoryModel = require("../models/M_Categories")

router.get("/index", (req, res) => {
  //Sử dụng clas C_Admin
  var use_C_Admin = new C_Admin(req.originalUrl);

  var V_Main = use_C_Admin.get_views("V_Main");
  res.render("admins/V_Index", { V_Main });
});

router.get("/add", (req, res) => {
  // Sử dụng class C_Admin
  var use_C_Admin = new C_Admin(req.originalUrl);
  // //Sử dụng clas C_Html
  // var use_C_Html = new C_Html(req.originalUrl);
  //Sử dụng clas C_Categories
  var use_C_Categories = new C_Categories(req.originalUrl);

  //list categories
  const List_Categories = [
    { name: 'Thiết bị điện tử', value: 1 },
    { name: 'Phụ kiện điện tử', value: 2 },
    { name: 'Sức khoẻ và làm đẹp', value: 3 },
  ]

  //form
  const Array_Form = [
    {
      element: "input",
      type: "text",
      name: "name",
      id: "name",
      class: "name",
      placeholder: "Nhập Tên",
      required: true,
      changeTitleToSlug: true
    },
    {
      element: "input",
      type: "text",
      name: "slug",
      id: "slug",
      class: "slug",
      placeholder: "Nhập Slug",
      required: true,
      changeTitleToSlug: false
    },
    {
      element: "select",
      array: List_Categories,
      name: "parents",
      id: "parents",
      class: "parents",
      placeholder: "Nhập Slug",
      required: false
    },
  ];

  //Gọi Html của form từ class html
  const List_Form = use_C_Categories.get_html_categories(Array_Form)

  var V_Main = use_C_Admin.get_views("V_Form");
  res.render("admins/V_index", { V_Main, List_Form });
});

router.get("/edit/:id", (req, res) => {
  // Sử dụng class C_Admin
  var use_C_Admin = new C_Admin(req.originalUrl);

  var V_Main = use_C_Admin.get_views("V_Form");
  res.render("admins/V_index", { V_Main });
});

router.post('/proccessForm', function (req, res) {
  var name = slug = parents = error = "";
  var flag = 1;

  //Lấy dữ liệu
  name = req.body.name;
  slug = req.body.slug;
  parents = req.body.parents;

  //Kiểm tra dữ liệu
  if (name == "") {
    flag = 0;
    error += "Vui lòng nhập Tên, ";
  }

  if (slug == "") {
    flag = 0;
    error += "Vui lòng nhập Slug, ";
  }

  //Tổng kết
  if (flag == 1) {
    //DB
    categoryModel
      .find({ name })
      .exec((err, data) => {
        if (err) {
          res.send({ kq: 0, data: "Kết nối Database thất bại" })
        } else {
          res.send({ kq: 1, data: "Ok" })
        }
      });
  } else {
    res.send({ kq: 0, data: error.substring(0, error.lastIndexOf(", ")) })
  }

})

module.exports = router;
