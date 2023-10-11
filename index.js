const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");

//.env 연결
dotenv.config();
//json형태로 데이터 전달
app.use(express.json()); 
app.use("/images", express.static(path.join(__dirname, "/images")));

//mongoose
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

  
  //파일 업로드시 저장될 위치 지정
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images");
    },
    filename: (req, file, cb) => {
      cb(null, "이름지정.jpeg")
    },
  });

  //업로드
  const upload = multer({ storage: storage });
  app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("파일이 업로드 되었습니다.");
  });


  //url설정
  app.use("/api/auth", authRoute);
  app.use("/api/users", userRoute);
  app.use("/api/post", postRoute);
  app.use("/api/categories", categoryRoute);

app.listen("5000", ()=> {
  console.log("Backend is running");
})