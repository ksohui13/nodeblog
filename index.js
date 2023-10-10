const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");

//.env 연결
dotenv.config();
//json형태로 데이터 전달
app.use(express.json()); 

//mongoose
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

  //url설정
  app.use("/api/auth", authRoute);
  app.use("/api/users", userRoute);

app.listen("5000", ()=> {
  console.log("Backend is running");
})