//サーバーの立ち上げ
const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const PORT = 3000;
const mongoose = require("mongoose");
//.envファイル使用
require("dotenv").config();

//DB接続
mongoose
  .connect(process.env.MONGO_URL)
  //then()は非同期処理
  .then(() => {
    console.log("DB接続中...");
  })
  .catch((err) => {
    console.log(err);
  });

//ルーティング設定
app.get("/", (req, res) => {
  res.send("hello express");
});

//ミドルウェア
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(PORT, () => console.log("サーバー起動"));
