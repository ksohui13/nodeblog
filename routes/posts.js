const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//게시글 작성
router.post("/", async(req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost)
    } catch (err) {
        res.status(500).json(err);
    }
});

//게시글 수정
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.username == req.body.username){
            try {
                const updatedPost = await Post.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set : req.body,
                    },
                    {new:true}
                );
                res.status(200).json(updatedPost);
            } catch(err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json("본인 게시물만 수정이 가능합니다!")
        }
    } catch(err) {
        res.status(500).json(err);
    }
});

//게시글 삭제
router.delete("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.username === req.body.username) {
        try {
          await post.delete();
          res.status(200).json("게시물이 삭제 되었습니다.");
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(401).json("본인 게시물만 삭제가 가능합니다!");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //게시글 가져오기
  router.get("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch(err) {
        res.status(500).json(err);
    }
  });


//모든 게시글 가져오기
router.get("/", async (req, res) => {
    const username = req.query.user;
    const catName = req.query.cat;
    try {
      let posts;
      if (username) {
        posts = await Post.find({ username });
      } else if (catName) {
        posts = await Post.find({
          categories: {
            $in: [catName],
          },
        });
      } else {
        posts = await Post.find();
      }
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router