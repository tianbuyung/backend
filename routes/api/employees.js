const express = require("express");
const router = express.Router();

const employeesController = require("../../controllers/employeesController");

router
  .route("/")
  .get(employeesController.readAllEmployees)
  .post(employeesController.createNewEmployee)
  .put(employeesController.updateEmployee)
  .delete(employeesController.deleteEmployee);

router.route("/:id").get(employeesController.readEmployee);

module.exports = router;
