const path = require("path");

// creating data as fetched form api
const fsP = require("fs").promises;

const data = {
  employees: require("../models/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createNewEmployee = async (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    res.json({ message: "Enter valid firstName and lastName" });
    return;
  }

  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1,
    firstName: firstName,
    lastName: lastName,
  };
  data.setEmployees([...data.employees, newEmployee]);
  //   await fsP.writeFile(path.join(__dirname, "..", "models", "employees.json"));

  console.log(data.employees);
  res
    .status(201)
    .json({ message: "Successfully created!", data: data.employees });
};

const updateNewEmployee = (req, res) => {
  const { id, firstName, lastName } = req.body;

  const employee = data.employees.find(
    (employee) => req.body.id === employee.id
  );
  if (!firstName && !lastName) {
    res.json({ message: "Enter valid firstName and lastName" });
    return;
  }
  employee.firstName = firstName;
  employee.lastName = lastName;

  data.employees = data.employees.filter((employee) => employee.id != id);
  const unSortedArray = [...data.employees, employee];
  console.log(unSortedArray);
  data.setEmployees(unSortedArray.sort((a, b) => a.id - b.id));

  res.json({
    data: data.employees,
  });
};

const deleteNewEmployee = (req, res) => {
  // res.json({ id: req.body.id });
  const { id } = req.body;
  console.log(typeof id);
  const employee = data.employees.find((employee) => id === employee.id);
  if (!employee) res.json({ message: "Enter valid employee ID" });
  const otherEmployees = data.employees.filter(
    (employee) => employee.id !== id
  );
  data.setEmployees([...otherEmployees]);
  res.json(data.employees);
};

const getAnEmployee = (req, res) => {
  console.log(typeof req.params.id);
  const getUser = data.employees.find(
    (employee) => req.params.id == employee.id
  );
  console.log(getUser);
  res.json(getUser);
};
module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateNewEmployee,
  deleteNewEmployee,
  getAnEmployee,
};
