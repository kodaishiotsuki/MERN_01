const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//投稿を作成する
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json("投稿完了しました");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//投稿を更新する
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({
        $set: req.body,
      });
    } else {
      return res.status(403).json("他の人の投稿を編集できません");
    }
    return res.status(200).json("投稿編集に成功しました");
  } catch (err) {
    return res.status(403).json(err);
  }
});

//投稿を削除する
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
    } else {
      return res.status(403).json("他の人の投稿を削除できません");
    }
    return res.status(200).json("投稿削除に成功しました");
  } catch (err) {
    return res.status(403).json(err);
  }
});

//投稿を取得する
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (err) {
    return res.status(403).json(err);
  }
});

//特定の投稿にいいねを押す
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //まだ投稿にいいねが押されていない場合
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: {
          likes: req.body.userId,
        },
      });
      return res.status(200).json("投稿にいいねを押しました");
    } else {
      //いいねしているユーザーIDを取り除く
      await post.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      return res.status(403).json("投稿にいいねを外しました");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//タイムラインの投稿取得（自分の投稿）
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    return res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//タイムラインの投稿取得（自分の投稿＋フォローユーザーの投稿）
//:idと重複防止のため,/timeline/all
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    //友達の投稿内容全て取得
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    return res.status(200).json(userPosts.concat(...friendPosts)); //map関数で一つ一つ取り出したので,スプレッド構文必要
  } catch (err) {
    res.status(500).json(err);
  }
});

//エクスポート
module.exports = router;
