import { Button, message, Select } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";

const Editvisitor = ({
  handleClose,
  editid,
  getvisitors,
  getload,
  updated,
}) => {
  const [employees, setEmployees] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false); // Add a loading state
  const [formData, setFormdata] = useState({
    name: "",
    mobile: "",
    address: "",
    visitingpurpose: "",
    visitingperson: "",
    photo: "",
  });
  const [errors, setErrors] = useState({}); // State for form validation errors

  // Options for the purpose of visit
  const purposeVisitOptions = [
    { value: "Business", label: "Business" },
    { value: "Personal", label: "Personal" },
  ];

  // Employee options for the "Visiting Person" dropdown
  const employeeOptions = employees.map((employee) => ({
    value: employee.name,
    label: employee.name,
  }));

  // Fetch visitor data by ID when the component mounts or editid changes
  const Getvisitorbyid = async () => {
    try {
      const response = await axios.get(
        `http://192.168.1.27:8090/api/getvisitorbyid/${editid}`
      );

      const data = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      const visitordata = {
        name: data.name || "",
        mobile: data.mobile || "",
        address: data.address || "",
        visitingpurpose: data.visitingpurpose || "",
        visitingperson: data.visitingperson || "",
        photo: data.photo || "",
      };

      setFormdata(visitordata);
      setInitialData(visitordata);
    } catch (error) {
      console.error("Error fetching visitor data:", error);
    }
  };

  // Fetch employees data for the select dropdown
  const GetEmployees = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(
        "http://192.168.1.27:8090/api/employees"
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle select changes for visiting person and purpose
  const handleSelectChange = (name, value) => {
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate Fullname
    if (!formData.name.trim()) {
      newErrors.name = "Fullname is required.";
      isValid = false;
    }

    // Validate Mobile
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be a 10-digit number.";
      isValid = false;
    }

    // Validate Address
    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
      isValid = false;
    }

    // Validate Visiting Person
    if (!formData.visitingperson) {
      newErrors.visitingperson = "Visiting person is required.";
      isValid = false;
    }

    // Validate Purpose of Visit
    if (!formData.visitingpurpose) {
      newErrors.visitingpurpose = "Purpose of visit is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const [messageApi, contextHolder] = message.useMessage();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submitting
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    try {
      const response = await axios.put(
        `http://192.168.1.27:8090/api/updatevisitor/${editid}`,
        formData
      );

      const responseData = response.data;

      if (responseData.message === "No changes were made.") {
        messageApi.open({
          type: "warning",
          content: "No changes made",
        });
        // alert("No changes made");
      }

      if (JSON.stringify(formData) === JSON.stringify(initialData)) {
        messageApi.open({
          type: "warning",
          content: "No changes made",
        });
        return; // Stop form submission if no changes
      }

      if (responseData.message === "Visitor updated successfully.") {
        updated();
        // messageApi.open({
        //   type: "success",
        //   content: "Updated successfully",
        // });
        // alert("Updated successfully");
        getload();
        getvisitors();
      }

      handleClose();
    } catch (error) {
      console.error("Error updating visitor:", error);
    }
  };

  // Fetch data on mount or when editid changes
  useEffect(() => {
    if (editid) {
      Getvisitorbyid();
    }
    GetEmployees();
  }, [editid]);

  return (
    <div>
      {contextHolder}
      <form
        className="flex flex-col gap-3 lg:w-1/2 m-auto"
        onSubmit={handleSubmit}
      >
        {/* Fullname Input */}
        <div>
          <label className="font-semibold">Fullname:</label>
          <input
            type="text"
            name="name"
            className="w-full px-3 py-2 border rounded-md outline-none"
            placeholder="Enter Fullname"
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Mobile Input */}
        <div>
          <label className="font-semibold">Mobile:</label>
          <input
            type="text"
            name="mobile"
            className="w-full px-3 py-2 border rounded-md outline-none"
            placeholder="Enter Mobile"
            value={formData.mobile}
            onChange={handleInputChange}
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm">{errors.mobile}</p>
          )}
        </div>

        {/* Address Input */}
        <div>
          <label className="font-semibold">Address:</label>
          <input
            type="text"
            name="address"
            className="w-full px-3 py-2 border rounded-md outline-none"
            placeholder="Enter Address"
            value={formData.address}
            onChange={handleInputChange}
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address}</p>
          )}
        </div>

        {/* Visiting Person Select */}
        <div>
          <label className="font-semibold">Visiting Person:</label>
          <Select
            className="w-full h-10 border rounded-md"
            value={formData.visitingperson}
            onChange={(value) => handleSelectChange("visitingperson", value)}
            showSearch
            listHeight={200}
            placeholder="Select visiting person"
            options={employeeOptions}
            loading={loading} // Pass the loading state to show the loading spinner
          />
          {errors.visitingperson && (
            <p className="text-red-500 text-sm">{errors.visitingperson}</p>
          )}
        </div>

        {/* Purpose of Visit Select */}
        <div>
          <label className="font-semibold">Purpose of visit:</label>
          <Select
            className="w-full h-10 rounded-md"
            value={formData.visitingpurpose}
            onChange={(value) => handleSelectChange("visitingpurpose", value)}
            listHeight={200}
            placeholder="Select Purpose"
            options={purposeVisitOptions}
          />
          {errors.visitingpurpose && (
            <p className="text-red-500 text-sm">{errors.visitingpurpose}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-row gap-4">
          <div className="btn btn-light w-full" onClick={handleClose}>
            Cancel
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Update Visitor
          </button>
        </div>
      </form>
    </div>
  );
};

export default Editvisitor;
