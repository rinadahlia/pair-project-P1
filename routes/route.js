const express = require("express");
const UserController = require("../controllers/userController");
const route = express.Router();

const multer = require("multer");
const upload = multer({ dest: "assets/" });

// middleware untuk checking apakah sudah login
const isLogin = (req, res, next) => {
  if (!req.session.account) {
    res.redirect("/login?errMsg=Access denied! Login first.");
  } else {
    next();
  }
};
 
// landing page
route.get("/", UserController.landingPage);

//register get and post
route.get("/register", UserController.showFormRegist);
route.post("/register", UserController.postFormRegistUser);

//login get and post
route.get("/login", UserController.showFormLogin);
route.post("/login", UserController.postFormLogin);

// home page get and post when user login
route.get("/home/:id", isLogin, UserController.home);
route.post("/home/:id", isLogin, UserController.postHome);

// profile page get and post
route.get("/home/:id/profile", isLogin, UserController.showFormAddProfile);
route.post(
  "/home/:AccountId/profile",
  isLogin,
  UserController.postFormAddProfile
);

// post page get and post
route.get("/home/:id/edit", isLogin, UserController.showFormEdit);
route.post("/home/:id/edit", isLogin, UserController.postFormEdit);

// delete post
route.get(
  "/home/:AccountId/delete/:PostId",
  isLogin,
  UserController.deleteById
);

// logout
route.get("/logout", UserController.logout);

module.exports = route;
