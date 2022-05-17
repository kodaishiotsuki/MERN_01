const router = require("express").Router();
const User = require("../models/User");

//ユーザー登録
router.post("/register", async (req, res) => {
  try {
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    //DB保存
    const user = await newUser.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//ログイン
router.post("/login", async (req, res) => {
  try {
    //user情報取得
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("ユーザーが見つかりません");

    //password
    const vailedPassword = req.body.password === user.password;
    if (!vailedPassword) return res.status(400).json("パスワードが違います");

    //ログイン成功
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//エクスポート
module.exports = router;