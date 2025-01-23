const employeeModel = require("../models/Employeemodel");

async function RegisterEmployee(req, res) {
  try {
    const { name, email, profile, mobile, empid, position } = req.body;

    if (!name) {
      return res.status(201).json({
        message: "please provide name",
        error: true,
        success: false,
      });
    }

    if (!email) {
      return res.status(201).json({
        message: "please provide email",
        error: true,
        success: false,
      });
    }

    if (!mobile) {
      return res.status(201).json({
        message: "please provide name",
        error: true,
        success: false,
      });
    }

    if (!empid) {
      return res.status(201).json({
        message: "please provide name",
        error: true,
        success: false,
      });
    }

    const user = await employeeModel.findOne({ empid });

    if (user) {
      return res.json({
        message: "employee already exist",
        success: false,
        error: true,
      });
    }

    const user1 = await employeeModel.findOne({ name });
    if (user1) {
      return res.json({
        message: "employee with name already exist",
        success: false,
        error: true,
      });
    }

    const newemployee = {
      name,
      email,
      profile,
      mobile,
      empid,
      position,
    };

    const employee = await employeeModel.create(newemployee);

    res.status(200).json({
      message: "Employee created successfully",
      success: true,
      error: false,
      employee: employee,
    });
  } catch (error) {
    console.log("error", error);
  }
}

module.exports = RegisterEmployee;
