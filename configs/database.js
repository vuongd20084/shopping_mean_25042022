const mongoose = require("mongoose");

mongoose
    .connect(
        "mongodb+srv://quocvuong:Mean234@cluster0.3jry1rr.mongodb.net/mean_25_04_2022?retryWrites=true&w=majority"
    )
    .then(() => {
        console.log("Kết nối thành công");
    })
    .catch((error) => {
        console.log(error);
    });
