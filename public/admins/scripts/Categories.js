class Categories extends Admin {
    proccessForm(url = '', isEdit = 0) {
        //Khai báo
        var name = "";
        var slug = "";
        var parents = "";
        var error = "";
        var flag = 1;

        //Lấy dữ liệu
        name = $("#name").val();
        slug = $("#slug").val();
        parents = $("#parents").val();

        //Kiểm tra dữ liệu
        if (name == "") {
            flag = 0;
            $(".error_name").text("Vui lòng nhập Tên");
        } else {
            $(".error_name").text("");
        }

        if (slug == "") {
            flag = 0;
            $(".error_slug").text("Vui lòng nhập Slug");
        } else {
            $(".error_slug").text("");
        }

        //Tổng kết
        if (flag == 1) {
            this.send_ajax(url, { name, slug, parents, isEdit })
        }
    }
}