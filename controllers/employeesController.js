const Employee = require("../models/Employee");

const readAllEmployees = async (req, res) => {
  const employees = await Employee.find();

  if (!employees)
    return res.status(404).json({
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
    res.status(500).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Id parameter is required" });
  }

  try {
    const employee = await Employee.findOne({ _id: req.body.id }).exec();

    if (!employee) {
      return res
        .status(404)
        .json({ message: `No employee matches ID ${req.body.id}` });
    }

    if (req?.body?.firstname) employee.firstname = req.body.firstname;
    if (req?.body?.lastname) employee.lastname = req.body.lastname;

    const result = await employee.save();

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Id parameter is required" });
  }

  try {
    const employee = await Employee.findOne({ _id: req.body.id }).exec();

    if (!employee) {
      return res
        .status(404)
        .json({ message: `No employee matches ID ${req.body.id}` });
    }

    const result = await employee.deleteOne({ _id: req.body.id });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const readEmployee = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Id parameter is required" });
  }

  try {
    const employee = await Employee.findOne({ _id: req.params.id }).exec();

    if (!employee) {
      return res
        .status(204)
        .json({ message: `No employee matches ID ${req.params.id}` });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  readAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  readEmployee,
};
