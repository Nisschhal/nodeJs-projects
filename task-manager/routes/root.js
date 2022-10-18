const express = require("express");
const router = express.Router();
const path = require("path");

// home/index url
router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

// redirected to new page
router.get("/old-page(.html)?", (req, res) => {
  res.redirect("/index.html");
});

module.exports = router;
