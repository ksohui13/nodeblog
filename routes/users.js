const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

//User UPDATE
//Update는 put 메소드 사용
router.put("/:id",async(req, res) => {
    if(req.body.userId == req.params.id){
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        try{
            const updateUser = await User.findByIdAndUpdate(
                req.params.id, 
                {
                $set:req.body,
            },
            {new:true}
            ); 
            res.status(200).json(updateUser)
        } catch(err) {
            res.status(500).json(err);
        }
    } else{
        res.status(401).json("본인 계정만 수정이 가능합니다.")
    }
})

//User Delete
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        try {
          await Post.deleteMany({ username: user.username });
          await User.findByIdAndDelete(req.params.id);
          res.status(200).json("계정이 삭제되었습니다.");
        } catch (err) {
          res.status(500).json(err);
        }
      } catch (err) {
        res.status(404).json("계정을 찾을 수 없습니다!");
      }
    } else {
      res.status(401).json("본인 계정만 삭제할 수 있습니다!");
    }
  });


  //Get User
  router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  



module.exports = router;