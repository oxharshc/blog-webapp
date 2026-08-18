const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const { marked } = require("marked");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const { requireAuth } = require("../middleware/authentication.js");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);
const Blog = require("../models/blog.js");
const Comment = require("../models/comment.js");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", requireAuth, (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get("/allblogs", async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .populate("createdBy")
      .sort({ createdAt: -1 });
    return res.render("allblogs", {
      user: req.user,
      blogs,
    });
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    return res.redirect("/");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    if (!blog) {
      return res.status(404).render("index", {
        user: req.user,
        blogs: [],
        error: "Blog post not found",
      });
    }

    const comments = await Comment.find({ blogId: req.params.id }).populate(
      "createdBy",
    );

    // Convert markdown to safe HTML
    const htmlBody = DOMPurify.sanitize(marked.parse(blog.body || ""));

    return res.render("blog", {
      user: req.user,
      blog,
      htmlBody,
      comments,
    });
  } catch (error) {
    console.error("Error loading blog:", error);
    return res.redirect("/");
  }
});

router.post("/comment/:blogId", requireAuth, async (req, res) => {
  try {
    await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
  } catch (error) {
    console.error("Error posting comment:", error);
    return res.redirect(`/blog/${req.params.blogId}`);
  }
});

router.post("/", requireAuth, upload.single("coverImage"), async (req, res) => {
  try {
    const { title, body } = req.body;
    const coverImageURL = req.file ? `/uploads/${req.file.filename}` : "/images/default.jpg";

    const blog = await Blog.create({
      body,
      title,
      createdBy: req.user._id,
      coverImageURL,
    });
    return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.error("Error creating blog post:", error);
    return res.render("addBlog", {
      user: req.user,
      error: "Failed to create blog post. Please try again.",
    });
  }
});

module.exports = router;