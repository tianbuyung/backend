const data = {};
data.employees = require("../models/employees.json");

const readAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createNewEmployee = (req, res) => {
  res.json({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });
};

const updateEmployee = (req, res) => {
  res.json({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });
};

const deleteEmployee = (req, res) => {
  res.json({
    id: req.body.id,
  });
};

const readEmployee = (req, res) => {
  res.json({ id: req.params.id });
};

module.exports = {
  readAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  readEmployee,
};
