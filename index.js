import express, { json } from "express"
import { registerValidation, loginValidation} from "./validations/auth.js"
import mongoose from "mongoose"
import checkAuth from "./utils/checkAuth.js"
import {register, login, getMe} from "./controllers/UserController.js"
import {createPostValidation} from "./validations/post.js"
import {createPost, getAllPosts, getOnePost, removePost, updatePost} from "./controllers/PostController.js"


const app = express()

mongoose.connect("mongodb+srv://Andrew:CaFMA3g6N8mFmgPo@cluster0.kjby4.mongodb.net/?retryWrites=true&w=majority")
  .then(console.log("DB connected"))
  .catch((err) => console.log("DB error" + err))

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello")})
app.post("/auth/register", registerValidation, register)
app.post("/auth/login", loginValidation, login )
app.get("/auth/me",checkAuth, getMe)

app.get("/posts", getAllPosts)
app.get("/posts/:id", getOnePost)
app.post("/posts",checkAuth, createPostValidation, createPost)
app.delete("/posts/",checkAuth, removePost)
app.patch("/posts/",checkAuth, updatePost)



app.listen(8000, (err) => {
  if (err) {
    console.log("Server error")
  }
  console.log("Server is running!")
})