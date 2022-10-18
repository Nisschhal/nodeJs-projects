const express = require("express");
const path = require("path");
const router = express.Router();
const employeeController = require("../../controllers/employeeControllers");

// to get employees
router
  .route("/")
  .get(employeeController.getAllEmployees)
  .post(employeeController.createNewEmployee)
  .patch(employeeController.updateNewEmployee)
  .delete(employeeController.deleteNewEmployee);

// for an employee
router.route("/:id").get(employeeController.getAnEmployee);

module.exports = router;
