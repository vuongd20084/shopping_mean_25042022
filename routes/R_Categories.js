const express = require("express");

const router = express.Router();

//gọi class admin
const C_Admin = require("../class/C_Admin");
//gọi class html
const C_Html = require("../class/C_Html");
//gọi class Categories
const C_Categories = require("../class/C_Categories");

//Call models
const categoryModel = require("../models/M_Categories");



router.get("/index", async (req, res) => {
  //Sử dụng clas C_Admin
  var use_C_Admin = new C_Admin(req.originalUrl);

  await categoryModel
    .find()
    .sort({ _id: -1 })
    .exec((err, data) => {
      if (err) {
        res.send({ kq: 0, result: "Kết nối database thất bại" })
      } else {
        var use_C_Categories = new C_Categories(req.originalUrl)

        var new_array = []


        data.forEach((e) => {

          new_array.push({
            _id: e._id.toString(),
            name: e.name,
            parents: (e.parents == null) ? '' : e.parents.toString(),
            status: e.status,
            date_created: e.date_created
          })
        })

        // console.log(new_array)

        const table = use_C_Categories.get_html_table(new_array)

        //Cho /proccessForm biết không phải edit
        var isEdit = 0

        var V_Main = use_C_Admin.get_views("V_Main");
        res.render("admins/V_Index", {
          V_Main, table, isEdit,
          nameModule: use_C_Admin.get_name_module(),
          popupDelete: 1
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
      required: false,
      dequy: true
    },
  ];

  //Gọi Html của form từ class html
  const List_Form = use_C_Categories.get_html_form(Array_Form)

  //Cho /proccessForm biết không phải edit
  var isEdit = 0

  var V_Main = use_C_Admin.get_views("V_Form");
  res.render("admins/V_index", {
    V_Main, List_Form, isEdit,
    nameModule: use_C_Admin.get_name_module(),
    popupDelete: 0
  });
});

router.get("/edit/:id", (req, res) => {// Sử dụng class C_Admin
  var _id = req.params.id

  categoryModel
    .find({ _id })
    .exec(async (err, data) => {
      if (err) {
        res.send({ kq: 0, result: "Kết nối Database thất bại" })
      } else {
        if (data == '') {
          res.send({ kq: 0, result: "Dữ liệu không tồn tại" })
        } else {

          var use_C_Admin = new C_Admin(req.originalUrl);
          // //Sử dụng clas C_Html
          // var use_C_Html = new C_Html(req.originalUrl);
          //Sử dụng clas C_Categories
          var use_C_Categories = new C_Categories(req.originalUrl);

          //list categories

          var new_array = []
          var old_array = await categoryModel.find()

          old_array.forEach(e => {
            new_array.push({
              _id: e._id.toString(),
              parents: (e.parents == null) ? '' : e.parents.toString(),
              name: e.name,
              value: e._id,
              selected: data[0].parents
            })
          })
          const List_Categories = new_array

          //form
          const Array_Form = [
            {
              element: "input",
              type: "text",
              name: "name",
              value: data[0].name,
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
              value: data[0].slug,
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
              required: false,
              dequy: true
            },
          ];

          //Gọi Html của form từ class html
          const List_Form = use_C_Categories.get_html_form(Array_Form)

          //Cho /proccessForm biết đang là edit
          var isEdit = data[0]._id

          var V_Main = use_C_Admin.get_views("V_Form");
          res.render("admins/V_index", {
            V_Main, List_Form, isEdit,
            nameModule: use_C_Admin.get_name_module(),
            popupDelete: 0
          });
        }
      }
    })


});

router.post('/proccessForm', function (req, res) {
  var name = slug = parents = error = "";
  var isEdit = 0
  var flag = 1;

  //Lấy dữ liệu
  name = req.body.name;
  slug = req.body.slug;
  parents = req.body.parents;
  isEdit = req.body.isEdit

  //Kiểm tra dữ liệu
  if (name == "") {
    flag = 0;
    error += "Vui lòng nhập Tên, ";
  }

  if (slug == "") {
    flag = 0;
    error += "Vui lòng nhập Slug, ";
  }
  //parents ko nhận chuỗi rỗng
  if (parents == '') parents = null

  //Tổng kết
  if (flag == 1) {
    //DB
    categoryModel
      .find({ name, slug }) //kiểm tra name và slug tồn tại chưa
      .exec((err, data) => {
        if (err) {
          res.send({ kq: 0, result: "Kết nối Database thất bại" })
        } else {
          if (data == '') {
            //Thêm dữ liệu
            const obj = { name, slug, parents }

            if (isEdit == 0) {
              categoryModel
                .create(obj, (err, data) => {
                  if (err) {
                    console.log(err)
                    res.send({ kq: 0, result: "Kết nối Database thất bại" })
                  } else {
                    res.send({ kq: 1, result: "Đã thêm thành công" })
                  }
                })
            } else {
              categoryModel
                .updateOne({ _id: isEdit }, obj, (err, data) => {
                  if (err) {
                    console.log(err)
                    res.send({ kq: 0, result: "Kết nối Database thất bại" })
                  } else {
                    res.send({ kq: 1, result: "Đã cập nhật thành công" })
                  }
                })
            }

          } else {
            res.send({ kq: 1, result: "Dữ liêu đã tồn tại" })
          }

        }
      });
  } else {
    res.send({ kq: 0, result: error.substring(0, error.lastIndexOf(", ")) })
  }

})

router.post('/delete', function (req, res) {
  var _id = req.body.id

  categoryModel
    .find({ _id })
    .exec((err, data) => {
      if (err) {
        res.send({ kq: 0, results: "Kết nối Database thất bại" })
      } else {
        if (data == '') {
          res.send({ kq: 0, results: "Dữ liệu không tồn tại" })
        } else {
          //Xoá
          categoryModel
            .findOneAndDelete({ _id }, (err) => {
              if (err) {
                res.send({ kq: 0, results: "Kết nối Database thất bại" })
              } else {
                res.send({ kq: 1, results: "Xoá thành công" })
              }
            })
        }
      }
    })

})



module.exports = router;
