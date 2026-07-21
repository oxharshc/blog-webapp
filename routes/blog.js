const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const { marked } = require("marked");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const {
  checkForAuthenticationCookie,
  requireAuth,
} = require("../middleware/authentication");

console.log("requireAuth:", typeof requireAuth);

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

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get("/allblogs", async (req, res) => {
  const blogs = await Blog.find({})
    .populate("createdBy")
    .sort({ createdAt: -1 });
  return res.render("allblogs", {
    user: req.user,
    blogs, // <-- this is what was missing
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy",
  );

  // Convert markdown to safe HTML
  const htmlBody = DOMPurify.sanitize(marked.parse(blog.body));

  return res.render("blog-single", {
    user: req.user,
    blog,
    htmlBody,
    comments,
  });
});

router.post("/comment/:blogId", requireAuth, async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
