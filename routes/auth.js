const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

//Register
router.post("/register", async (req, res) => {
    try{

        //비밀번호 암호화 bcrypt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        });

        const user = await newUser.save();
        res.status(200).json(user);
    } catch(err){
        res.status(500).json(err);
    }
});

//login
router.post("/login", async(req, res) => {
    try {
        const user = await User.findOne({username:req.body.username})
        !user && res.status(400).json("아이디가 잘못 되었습니다!")
        
        const validated = await bcrypt.compare(req.body.password, user.password)
        !validated && res.status(400).json("비밀번호가 잘못 되었습니다")

        //비밀번호를 제외하여 응답하기
        const {password, ...others} = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router
