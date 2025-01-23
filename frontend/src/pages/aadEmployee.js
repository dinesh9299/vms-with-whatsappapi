import axios from "axios";
import React, { useState, useEffect } from "react";
import { Alert, message, Spin } from "antd";
import RemindOutlineIcon from "@rsuite/icons/RemindOutline";
import { LoadingOutlined } from "@ant-design/icons";

const Addemployee = ({ handleClose, Getemployees, updated }) => {
  const [filename, setFlename] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    empid: "",
    profile: "",
    position: "",
  });
  const [saveloader, setSaveloader] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    empid: "",
    position: "",
    profile: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value, // Dynamically update the corresponding field in the state
    }));

    // Only validate the changed field after submit
    if (submitted) {
      validateField(name, value);
    }
  };

  // Handle file input change (profile picture)
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    console.log("file", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFlename(file);
        setFormData((prevState) => ({
          ...prevState,
          profile: reader.result, // Store base64 string
        }));

        // Only validate after submit
        if (submitted) {
          validateField("profile", reader.result);
        }
      };
      reader.readAsDataURL(file); // Read the file as base64
    }
  };

  // Validate individual fields
  const validateField = (field, value) => {
    let error = "";
    if (field === "name" && !value) {
      error = "Name is required";
    }
    if (field === "email") {
      if (!value) {
        error = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Email is not valid";
      }
    }
    if (field === "mobile") {
      if (!value) {
        error = "Mobile number is required";
      } else if (!/^\d{10}$/.test(value)) {
        error = "Mobile number should be 10 digits";
      }
    }
    if (field === "empid" && !value) {
      error = "Employee ID is required";
    }
    if (field === "position" && !value) {
      error = "Position is required";
    }
    if (field === "profile" && !value) {
      error = "Profile picture is required";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  // Validate the form data
  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Name validation
    if (!formData.name) {
      newErrors.name = "Name is required";
      valid = false;
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is not valid";
      valid = false;
    }

    // Mobile validation
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
      valid = false;
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number should be 10 digits";
      valid = false;
    }

    // Employee ID validation
    if (!formData.empid) {
      newErrors.empid = "Employee ID is required";
      valid = false;
    }

    // Position validation
    if (!formData.position) {
      newErrors.position = "Position is required";
      valid = false;
    }

    // Profile picture validation (optional)
    if (!formData.profile) {
      newErrors.profile = "Profile picture is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true); // Mark the form as submitted

    const valid = validateForm();

    if (valid) {
      setSaveloader(true);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8090/api/regemployee",
          formData
        );
        const responseData = response.data;

        if (responseData.message === "employee already exist") {
          messageApi.open({
            type: "warning",
            content: "employee already exist",
          });
          setSaveloader(false);
        }

        if (responseData.message === "employee with name already exist") {
          messageApi.open({
            type: "warning",
            content: "employee with name already exist",
          });
          setSaveloader(false);
        }

        if (responseData.success) {
          // alert("Employee created successfully!");
          // messageApi.open({
          //   type: "success",
          //   content: "employee Created successfully",
          // });
          updated();

          setFormData({
            name: "",
            email: "",
            mobile: "",
            empid: "",
            profile: "",
            position: "",
          });
          handleClose();
          setSaveloader(false);
          Getemployees();
          // window.location.reload(); // Close modal after submission
        }
      } catch (error) {
        console.error("Error creating employee:", error);
      }
    }
  };

  return (
    <div>
      {contextHolder}
      <form onSubmit={handleSubmit}>
        <div className=" font-semibold">Employee Id:</div>
        <input
          type="text"
          name="empid"
          value={formData.empid}
          onChange={handleInputChange}
          className={`${
            !errors.empid ? "mb-10 " : "mb-0 border-danger"
          } w-full px-3 py-2  border    rounded-md outline-none`}
          placeholder="Employee ID"
        />
        {submitted && errors.empid && (
          <div className="text-red-500 mb-3 flex gap-2 items-center">
            <RemindOutlineIcon className="w-3" />
            {errors.empid}
          </div>
        )}

        <div className=" font-semibold">Name:</div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`${
            !errors.name ? "mb-10" : "mb-0 border-danger"
          } w-full px-3 py-2  border  rounded-md outline-none`}
          placeholder="Name"
          // required
        />
        {submitted && errors.name && (
          <div className="text-red-500 mb-3 flex gap-2 items-center">
            <RemindOutlineIcon className="w-3" />
            {errors.name}
          </div>
        )}
        <div className=" font-semibold">Email:</div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`${
            !errors.email ? "mb-10" : "mb-0 border-danger"
          } w-full px-3 py-2  border  rounded-md outline-none`}
          placeholder="Email"
          // required
        />
        {submitted && errors.email && (
          <div className="text-red-500 mb-3 flex gap-2 items-center">
            <RemindOutlineIcon className="w-3" />
            {errors.email}
          </div>
        )}

        <div className=" font-semibold">Mobile:</div>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleInputChange}
          className={`${
            !errors.mobile ? "mb-10" : "mb-0 border-danger"
          } w-full px-3 py-2  border  rounded-md outline-none`}
          placeholder="Mobile"
          // required
        />
        {submitted && errors.mobile && (
          <div className="text-red-500 mb-3 flex gap-2 items-center">
            <RemindOutlineIcon className="w-3" />
            {errors.mobile}
          </div>
        )}

        <div className=" font-semibold">Position:</div>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleInputChange}
          className={`${
            !errors.position ? "mb-10" : "mb-0 border-danger"
          } w-full px-3 py-2  border  rounded-md outline-none`}
          placeholder="Position"
          // required
        />
        {submitted && errors.position && (
          <div className="text-red-500 mb-3 flex gap-2 items-center">
            <RemindOutlineIcon className="w-3" />
            {errors.position}
          </div>
        )}

        <div className=" font-semibold">Profile:</div>
        <input
          type="file"
          name="profile"
          id="file-input"
          onChange={handleFileChange}
          className={`${
            !errors.profile ? "mb-4" : "mb-0 border-danger"
          } w-full px-3 py-2  border  rounded-md outline-none hidden`}
        />

        <label
          htmlFor="file-input"
          className={`
            ${
              errors.profile
                ? "bg-red-100 border-red-500"
                : "bg-gray-100 border-blue-400"
            }
           block cursor-pointer px-6 py-2 text-center rounded-md border transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300  w-full`}
        >
          {" "}
          {filename ? `File Selected: ${filename.name}` : "Choose a file"}
        </label>
        {submitted && errors.profile && (
          <div className="text-red-500 mb-3 flex gap-2 items-center">
            <RemindOutlineIcon className="w-3" />
            {errors.profile}
          </div>
        )}

        <div className=" flex flex-row gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="mt-4 px-4 py-2 bg-gray-300 text-black rounded w-full"
          >
            Cancel
          </button>

          {saveloader ? (
            <button
              type="button"
              disabled={true}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded w-full"
            >
              Add Employee
              <Spin
                indicator={
                  <LoadingOutlined spin className=" ms-2 text-white" />
                }
              />
            </button>
          ) : (
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded w-full"
            >
              Add Employee
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Addemployee;
