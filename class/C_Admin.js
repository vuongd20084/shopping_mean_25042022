class C_Admin {
  constructor(url = "") {
    this.url = url;
  }

  get_name_module() {
    // /admin/dashboard/index

    //1. chuyển chuỗi thành mảng ['', 'admin', 'dashboard', 'index']
    //2. Lấy ra dashboard
    return this.url.split("/")[2];
  }

  get_views(path = "") {
    return path;
  }

  change_name(key = '') {
    var str = ''
    switch (key) {
      case 'name': str = "Nhập Tên"; break;
      case 'slug': str = "Nhập Slug"; break;
      case 'parents': str = "Chọn Cha"; break;

      default: str = 'No Name'; break;
    }

    return str;
  }

  input(
    _type = "text",
    _name = "",
    _value = "",
    _id = "",
    _class = "",
    _placeholder = "",
    _required = true,
    _changeTitleToSlug = true
  ) {
    var s_required = _required == true ? "required" : "";
    var changeTitleToSlug = _changeTitleToSlug == true ?
      'onchange="ChangeToSlug()" onkeyup="ChangeToSlug()" onkeydown="ChangeToSlug()"' : "";

    return `<input 
      type="`+ _type + `" 
      name="`+ _name + `" 
      value="`+ _value + `" 
      id="` + _id + `" 
      class="`+ _class + ` form-control"
      placeholder="`+ _placeholder + `"  ` + changeTitleToSlug +
      `>
      <span class="error error_`+ _name + `"></span>
    `;    // Đang tắt    ` +s_required + `

  }

  select(
    _array = [],
    _name = "",
    _id = "",
    _class = "",
    _required = true,
    _dequy = false
  ) {
    var s_required = _required == true ? "required" : "";

    var str = '<option value="">--Chọn--</option>'

    //Xét có đệ quy hay không
    if (_dequy == true) {
      str += this.dequy_select(_array)
    } else {
      _array.forEach(e => {
        str += '<option value="' + e.value + '">' + e.name + '</option>'
      });
    }



    return `<select
        name="`+ _name + `"
        class="`+ _class + ` form-control"
        id="`+ _id + `" ` + s_required + `>
        `+ str + `
    </select>
    <span class="error error_`+ _name + `"></span>
    `;


  }

  textarea(
    _rows = 3,
    _name = "",
    _id = "",
    _class = "",
    _required = true
  ) {
    var s_required = _required == true ? "required" : "";

    return `<textarea>
        rows="`+ rows + `"
        name="`+ _name + `"
        class="`+ _class + ` form-control"
        id="`+ _id + `" ` + s_required + `>
    </textarea>
    <span class="error error_`+ _name + `"></span>
    `;
  }

  dequy(array = [], id = null) {
    var json = []

    array.forEach(e => {
      if (e.parents == id) {//thằng cha
        json.push({
          name: e.name,
          // slug:e.slug,
          childs: this.dequy(array, e._id)
        })
      }
    })

    return json
  }

  dequy_select(_array, char = '', id = '') {
    var str = ''

    _array.forEach(e => {
      if (e.parents == id) {  //thằng cha

        //Xét selected
        var selected = (e._id == e.selected) ? 'selected' : ''

        str += '<option value="' + e.value + '"' + selected + '>' + char + e.name + '</option>'
        str += this.dequy_select(_array, char + '|----- ', e._id)
      }
    });

    return str
  }
}
module.exports = C_Admin;
