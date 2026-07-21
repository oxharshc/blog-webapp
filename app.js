require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog.js");

// Route setup
const userRoute = require("./routes/user.js");
const blogRoute = require("./routes/blog.js");

const {
  checkForAuthenticationCookie,
} = require("./middleware/authentication.js");

// Setting up express & port
const app = express();
const PORT = process.env.PORT || 8000;

// connect mongoose DB
mongoose
  //.connect("mongodb://localhost:27017/bloggerify")
  .connect(process.env.MONGO_URL)
  .then((e) => console.log("MongoDB is Connected"));

// set views
app.set("view engine", "ejs");
app.set("views", path.resolve("./views/"));

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public/")));

// When redirect to home page it will show all blogs
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});

  res.render("index", {
    user: req.user,
    blogs: allBlogs,
  });
});

// Routes for User & Blog
app.use("/user", userRoute);
app.use("/blog", blogRoute);

// Displaying Port no. in Terminal
app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));
