const express = require("express");
const router = express.Router();
const passport = require("passport");

//Import controllers
const {
  addAward,
  updateAward,
  deleteAward,
  getAwards,
  getAwardById,
} = require("../controllers/awards");

// @route   POST /api/awards
// @desc    Create new award
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  addAward,
);

// @route   PUT /api/awards/:id
// @desc    Update existing award
// @access  Private
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updateAward,
);

// @route   DELETE /api/awards/:id
// @desc    Delete existing award
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteAward,
);

// @route   GET /api/awards
// @desc    GET existing awards
// @access  Public
router.get("/", getAwards);

// @route   GET /api/awards/:id
// @desc    GET existing award by id
// @access  Public
router.get("/:id", getAwardById);

module.exports = router;
