import express, { json } from "express"
import { registerValidation, loginValidation } from "./validations/auth.js"
import mongoose from "mongoose"
import checkAuth from "./utils/checkAuth.js"
import { register, login, getMe } from "./controllers/UserController.js"
import { createPostValidation } from "./validations/post.js"
import { createPost, getAllPosts, getOnePost, removePost, updatePost, getTags } from "./controllers/PostController.js"
import multer from "multer"
import handleValidationErrors from "./utils/handleValidationErrors.js"
import cors from "cors"
import fs from 'fs';

const app = express()


const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(cors())
app.use('/uploads', express.static('uploads'));

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

mongoose.connect("mongodb+srv://Andrew:CaFMA3g6N8mFmgPo@cluster0.kjby4.mongodb.net/?retryWrites=true&w=majority")
  .then(console.log("DB connected"))
  .catch((err) => console.log("DB error" + err))

app.use(express.json())

app.post("/auth/register", registerValidation, handleValidationErrors, register)
app.post("/auth/login", loginValidation, handleValidationErrors, login)
app.get("/auth/me", checkAuth, getMe)

app.get("/posts", getAllPosts)
app.get("/tags", getTags)
app.get("/posts/:id", getOnePost)
app.post("/posts", checkAuth, createPostValidation, createPost)
app.patch("/posts/:id", checkAuth, createPostValidation, updatePost)
app.delete("/posts/:id", checkAuth, removePost)



app.listen(8000, (err) => {
  if (err) {
    console.log("Server error")
  }
  console.log("Server is running!")
})