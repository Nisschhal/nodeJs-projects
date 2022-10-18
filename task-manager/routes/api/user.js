const express = require("express");

const userControllers = require("../../controllers/userControllers");

const router = express.Router();

router
  .route("/")
  .get(userControllers.getAllUsers)
  .post(userControllers.createNewUser)
  .patch(userControllers.updateUserById)
  .delete(userControllers.deleteUserById);

module.exports = router;
