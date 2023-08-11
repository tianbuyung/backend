const express = require("express");
const router = express.Router();

const employeesController = require("../../controllers/employeesController");
const verifyJWT = require("../../middlewares/verifyJWT");

router
  .route("/")
  .get(verifyJWT, employeesController.readAllEmployees)
  .post(employeesController.createNewEmployee)
  .put(employeesController.updateEmployee)
  .delete(employeesController.deleteEmployee);

router.route("/:id").get(employeesController.readEmployee);

module.exports = router;
