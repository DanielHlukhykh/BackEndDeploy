const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const path = require("path");

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../static/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

//Import controllers
const {
  createPost,
  updatePost,
  updatePostLikes,
  deletePost,
  getPostById,
  getPostsFilterParams,
} = require("../controllers/post");

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.array("images", 5),
  createPost,
);

// @route   PUT api/posts/:id
// @desc    Update post
// @access  Private
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updatePost,
);

// @route   PATCH api/posts/:id
// @desc    Update post likes
// @access  Private
router.patch(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    updatePostLikes,
);

// @route   DELETE api/posts/:id
// @desc    DELETE existing post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deletePost,
);

// @route   GET api/posts
// @desc    GET appropriate filtered posts
// @access  Public
router.get("/", getPostsFilterParams);

// @route   GET api/posts/:id
// @desc    GET existing post
// @access  Public
router.get("/:id", getPostById);

module.exports = router;
