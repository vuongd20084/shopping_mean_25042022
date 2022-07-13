const express = require("express");

const router = express.Router();

//gọi class admin
const C_Admin = require("../class/C_Admin");
//gọi class html
const C_Html = require("../class/C_Html");
//gọi class Categories
const C_Categories = require("../class/C_Categories");
//gọi class Products
const C_Products = require("../class/C_Products");

//Call models
const categoryModel = require("../models/M_Categories");
const productModel = require("../models/M_Products");

router.get("/index(/:pageNumber)?", async (req, res) => {

  //??????????Search
  var obj_search = {}

  if (req.originalUrl.indexOf('?') != -1) {
    //Có search
    // ?s=abc: lấy dữ liệu từ đường link dùng query

    obj_search = { "name": { $regex: '.*' + req.query.s + '.*' } }
  }

  //////Phân trang
  let pageNumber = req.params.pageNumber
  let limit = 2

  var skip

  if (pageNumber == undefined || pageNumber == 1) {
    skip = 0
  } else {
    // 0 2 4 6 8 10
    skip = (pageNumber - 1) * limit
  }

  //Lấy tổng số sản phẩm
  var data_array = await productModel.find()
  var sumData = data_array.length
  var sumPage = Math.ceil(sumData / limit)
  //_______________

  //Sử dụng clas C_Admin
  var use_C_Admin = new C_Admin(req.originalUrl);
  //Sử dụng clas C_Html
  var use_C_Html = new C_Html(req.originalUrl);

  await productModel
    .find(obj_search)
    .sort({ _id: -1 })
    .limit(limit)
    .skip(skip)
    .exec((err, data) => {
      if (err) {
        res.send({ kq: 0, result: "Kết nối database thất bại" })
      } else {
        var use_C_Products = new C_Products(req.originalUrl)

        var new_array = []


        data.forEach((e) => {

          new_array.push({
            _id: e._id.toString(),
            name: e.name,
            status: e.status,
            date_created: e.date_created
          })
        })

        // console.log(new_array)

        const table = use_C_Products.get_html_table(new_array)

        //Cho /proccessForm biết không phải edit
        var isEdit = 0

        var V_Main = use_C_Admin.get_views("V_Main");
        res.render("admins/V_Index", {
          V_Main, table, isEdit,
          nameModule: use_C_Admin.get_name_module(),
          popupDelete: 1,
          pagination: use_C_Html.html_pagination(sumPage, pageNumber)
        });
      }
    })


});

router.get("/add", async (req, res) => {
  // Sử dụng class C_Admin
  var use_C_Admin = new C_Admin(req.originalUrl);
  // //Sử dụng clas C_Html
  // var use_C_Html = new C_Html(req.originalUrl);
  //Sử dụng clas C_Categories
  var use_C_Categories = new C_Categories(req.originalUrl);
  //Sử dụng clas C_Products
  var use_C_Products = new C_Products(req.originalUrl);

  //list categories

  var new_array = []
  var old_array = await categoryModel.find()

  old_array.forEach(e => {
    new_array.push({
      _id: e._id.toString(),
      parents: (e.parents == null) ? '' : e.parents.toString(),
      name: e.name,
      value: e._id,
    })
  })
  const List_Categories = new_array

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
      required: true,
      dequy: true
    },
  ];

  //Gọi Html của form từ class html
  const List_Form = use_C_Products.get_html_form(Array_Form)

  //Cho /proccessForm biết không phải edit
  var isEdit = 0

  var V_Main = use_C_Admin.get_views("V_Form");
  res.render("admins/V_index", {
    V_Main, List_Form, isEdit,
    nameModule: use_C_Admin.get_name_module(),
    popupDelete: 0
  });
});

module.exports = router;
