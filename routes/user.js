const { Router } = require("express");
const User = require("../models/user.js");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
      errorLink: {
        url: "/user/signup",
        text: "Don't have an account? Sign up here",
      },
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  // Check if email is already taken
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.render("signup", {
      error: "This email is already registered.",
      errorLink: { url: "/user/signin", text: "Sign in here" },
    });
  }

  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});

module.exports = router;
