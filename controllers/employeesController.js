const Employee = require("../models/employee");

const readAllEmployees = async (req, res) => {
  const employees = await Employee.find();

  if (!employees)
    return res.status(204).json({
      message: "No employees found",
    });

  res.status(200).json(employees);
};

const createNewEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: "First and last names are required" });
  }

  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Id parameter is required" });
  }

  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}` });
  }

  if (req?.body?.firstname) employee.firstname = req.body.firstname;
  if (req?.body?.lastname) employee.lastname = req.body.lastname;

  const result = await employee.save();

  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Id parameter is required" });
  }

  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}` });
  }

  const result = await employee.deleteOne({ _id: req.body.id });

  res.status(200).json(result);
};

const readEmployee = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Id parameter is required" });
  }

  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.params.id}` });
  }

  res.status(200).json(employee);
};

module.exports = {
  readAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  readEmployee,
};
