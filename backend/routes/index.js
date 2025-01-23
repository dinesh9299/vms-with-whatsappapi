require("dotenv").config();

const express = require("express");
const USersign = require("../controller/signin");
const verifyTokenAndCheckActivation = require("../controller/ActivatonToken"); // Import the middleware
const userDetailsController = require("../controller/getuser");
const RegisterEmployee = require("../controller/regemployee");
const GetEmployees = require("../controller/getemployees");
const Employeesearchbyname = require("../controller/emplyeesearchbyname");
const UserSignup = require("../controller/userController");
const Addvisitor = require("../controller/addvisitor");
const Getvisitors = require("../controller/getvisitors");
const Updatecheckin = require("../controller/updatecheckin");
const Updatecheckout = require("../controller/updatecheckout");
const GetEmployeebyid = require("../controller/getuserdetailsbyid");
const Getvisitorbyname = require("../controller/getvisitorslistbyname");
const Getvisitorbyid = require("../controller/getvisitorbyid");
const Updatevisitor = require("../controller/Editvisitor");
const Deletevisitor = require("../controller/Deletevisitor");
const Resetpasword = require("../controller/updatepassword");
const Getusers = require("../controller/Getusers");
const Usersearchbyname = require("../controller/usersearchbyname");
const Editemployee = require("../controller/EditEmployee");
const DeleteEmployeebyid = require("../controller/DeleteEmployeebyid");
const Getuserbyprimary = require("../controller/getuserbyid");
const Edituser = require("../controller/Edituser");
const Deleteuserbyid = require("../controller/deleteuserbyid");
const Deleteuserbyprimary = require("../controller/Deleteuserbyprimary");
const Whatsappapi = require("../controller/whatsappapi");
const WhatsappEmp = require("../controller/whatsapp_emp_notification");
const Ledcum = require("../controller/whatsappledcum");

const router = express.Router();

router.post("/register", UserSignup);

router.post("/login", USersign);

router.post("/getuser", userDetailsController);

router.post("/regemployee", RegisterEmployee);

router.get("/employees", GetEmployees);

router.post("/searchemployee", Employeesearchbyname);

//add visitor
router.post("/addvisitor", Addvisitor);

//get visitors
router.get("/getvisitors", Getvisitors);

//update checkin
router.put("/chekin/:id", Updatecheckin);

//update checkout
router.put("/checkout/:id", Updatecheckout);

//Get employee by id
router.get("/getempbyid/:id", GetEmployeebyid);

//Getvisitor by name filter
router.get("/getvisitorbyname/:name", Getvisitorbyname);

//Get visitor by id
router.get("/getvisitorbyid/:id", Getvisitorbyid);

//Editvisitor
router.put("/updatevisitor/:id", Updatevisitor);

//Delete Visitor
router.delete("/deletevisitor/:id", Deletevisitor);

//Reset password
router.put("/resetpassword/:id", Resetpasword);

//Get users
router.get("/getusers", Getusers);

//search users by name
router.post("/getuserbyname", Usersearchbyname);

//Edit Employee
router.put("/editemployee/:id", Editemployee);

//Edit User
router.put("/edituser/:id", Edituser);

//Delete Employee by id
router.delete("/deleteemployeebyid/:id", DeleteEmployeebyid);

//Get user by primary
router.get("/getuserbyprimary/:id", Getuserbyprimary);

//delete user by id
router.delete("/deleteuserbyid/:id", Deleteuserbyid);

//Delete User by primary
router.get("/deleteuserbyprimary/:id", Deleteuserbyprimary);

//whatsapp api
router.post("/whatsppapi", Whatsappapi);

//whatsappemp
router.post("/whatsappempnot", WhatsappEmp);

//ledcum
router.post("/ledcum", Ledcum);

module.exports = router;
