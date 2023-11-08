const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const port = 3300;

app.use(express.json());
app.use(cors());
const connectdb = async () => {
  try {
    const con = await mongoose.connect(
      "mongodb+srv://codingmania32:54321@cluster0.hgwsbrk.mongodb.net/?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        useNewURLParser: true,
      }
    );
    console.log(`Mongo connected `);
  } catch (error) {
    console.log(error);
  }
};
connectdb();
const usermodel = mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const userschema = mongoose.model("mon", usermodel);

app.post("/create", async (req, res) => {
  const data = userschema(req.body);
  await data.save();
  res.json({ message: "Data Saved" });
});
app.get("/", async (req, res) => {
  let data = await userschema.find({});
  res.json({ message: "data fetched", data: data });
});
app.put("/update", async (req, res) => {
  const { _id, ...rest } = req.body;
  await userschema.updateOne({ _id: _id }, rest);
  res.json({ message: "Data Updated" });
});
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const data = await userschema.deleteOne({ _id: id });
  res.json({ message: "data deleted" });
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "uploads");
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });
app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
});
app.listen(port, () => {
  console.log(`Listening To http://localhost:${port}`);
});
