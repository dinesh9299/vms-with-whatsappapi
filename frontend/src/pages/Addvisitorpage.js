import { Button, message, Select, Spin } from "antd";
import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Webcam from "react-webcam"; // Import react-webcam
import { MdOutlineFlipCameraIos } from "react-icons/md";
import { Loader } from "rsuite";
import { LoadingOutlined } from "@ant-design/icons";
import SignatureCanvas from "react-signature-canvas";
import { Steps, theme } from "antd";

const AddVisitorPage = ({
  handleClose,
  Getvisitors,
  getload,
  added,
  username,
}) => {
  const [employees, setEmployees] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const webcamRef = useRef(null);
  const [error, setError] = useState(false);
  const location = useLocation();
  const [swapcamera, setSwapcamera] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [saveloader, setSaveloader] = useState();
  const [isSignaturePadVisible, setIsSignaturePadVisible] = useState(false); // State to toggle visibility of SignaturePad
  const [signatureData, setSignatureData] = useState(""); // To store the base64 image of the signature
  const sigCanvas = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (location.pathname === "/employees") {
      setError(true);
    }
    if (location.pathname === "/profile") {
      setError(true);
    }
    if (location.pathname === "/users") {
      setError(true);
    }
    if (location.pathname === "/semployeedetails") {
      setError(true);
    }
    if (location.pathname === "/semployees") {
      setError(true);
    }
    if (location.pathname === "/susers") {
      setError(true);
    }

    if (location.pathname === "/sprofile") {
      setError(true);
    }

    if (location.pathname === "/adminemployees") {
      setError(true);
    }
  }, [location.pathname]);

  const [formData, setFormdata] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    visitingpurpose: "",
    visitingperson: "",
    photo: "",
    signature: "",
    createdby: username,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    signature: "",
    visitingpurpose: "",
    visitingperson: "",
    photo: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const validateField = (field, value) => {
    let error = "";

    if (current === 0) {
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
      // setSubmitted(false);
    }

    if (current === 1) {
      if (field === "address" && !value) {
        error = "Address is required";
      }

      if (field === "visitingpurpose" && !value) {
        error = "visiting purpose is required";
      }

      if (field === "visitingperson" && !value) {
        error = "visiting person is required";
      }
    }

    if (current === 2) {
      if (field === "photo" && !value) {
        error = "Photo is required !";
      }

      if (field === "signature" && !value) {
        error = "Signature is required !";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Name validation
    if (current === 0) {
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
    }

    if (current === 1) {
      // Employee ID validation
      if (!formData.address) {
        newErrors.address = "Address is required";
        valid = false;
      }

      // Position validation
      if (!formData.visitingpurpose) {
        newErrors.visitingpurpose = "Purpose is required";
        valid = false;
      }

      if (!formData.visitingperson) {
        newErrors.visitingperson = "visiting person is required";
        valid = false;
      }
    }
    if (current === 2) {
      // Profile picture validation (optional)
      if (!formData.photo) {
        newErrors.photo = "Profile picture is required";
        valid = false;
      }

      if (!formData.signature) {
        newErrors.signature = "Signature is required";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleTakePhoto = () => {
    setIsCameraActive(true);
  };

  // Function to capture the photo from the webcam
  const handleCapture = () => {
    if (webcamRef.current) {
      const imageData = webcamRef.current.getScreenshot(); // Capture image from webcam
      setPhoto(imageData); // Store the captured image in the state
      setFormdata((preve) => ({
        ...preve,
        photo: imageData,
      }));
      if (submitted) {
        validateField("photo", imageData);
      }
    }
  };

  //selectlist
  const handlePersonChange = (value) => {
    setFormdata((preve) => ({
      ...preve,
      visitingperson: value,
    }));

    if (submitted) {
      validateField("visitingperson", value);
    }
  };
  const handlevisitingreason = (value) => {
    setFormdata((preve) => ({
      ...preve,
      visitingpurpose: value,
    }));
    if (submitted) {
      validateField("visitingpurpose", value);
    }
  };

  // Fetch employees from API
  const GetEmployees = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8090/api/employees");
      setEmployees(response.data); // Assuming response.data is an array of employees
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Run GetEmployees once on component mount
  useEffect(() => {
    GetEmployees();
  }, []);

  // Map employees to options for the Select component
  const employeeOptions = employees.map((employee) => ({
    value: employee.name, // Assuming each employee has an 'id'
    label: employee.name, // Assuming each employee has a 'name'
  }));

  const purposevisitoptions = [
    {
      value: "Business",
      label: "Business",
    },
    {
      value: "Personal",
      label: "Personal",
    },
    // {
    //   value: "Interview",
    //   label: "Interview",
    // },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormdata((preve) => ({
      ...preve,
      [name]: value,
    }));
    if (submitted) {
      validateField(name, value);
    }
  };

  const [numberperson, setNumberperson] = useState("");

  const handleAddvisitor = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const valid = validateForm();

    if (valid) {
      setSaveloader(true);
      const response = await axios.post(
        "http://127.0.0.1:8090/api/addvisitor",
        formData
      );

      const responseData = response.data;
      setNumberperson(formData.visitingperson);

      if (responseData.success) {
        added();
        // alert("visitor added successfully");
        handleClose();
        setSaveloader(true);
        // setFormdata({
        //   name: "",
        //   emal: "",
        //   mobile: "",
        //   address: "",
        //   signature: "",
        //   visitingpurpose: "",
        //   visitingperson: "",
        //   photo: "",
        // });

        if (!error) {
          Getvisitors();
          getload();
        }

        const getempnumber = await axios.post(
          "http://127.0.0.1:8090/api/searchemployee",
          { query: formData.visitingperson }
        );

        alert(getempnumber.data[0].mobile);
        const emp = getempnumber.data[0];
        if (getempnumber.data[0].mobile) {
          await axios.post(
            "http://127.0.0.1:8090/api/whatsappempnot",
            {
              empname: emp.name,
              visitor: formData.name,
              destination: `+91${emp.mobile}`,
              purpose: formData.visitingpurpose,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
        // Getvisitors();
        // getload();
        // window.location.reload();
      }

      if (responseData.error) {
        alert("all fields are required");
      }
    }
  };

  const handlecameraswap = () => {
    setSwapcamera(!swapcamera);
  };

  const handleOpenSignaturePad = () => {
    setIsSignaturePadVisible(true); // Show the SignaturePad
  };

  const handleSaveSignature = () => {
    if (sigCanvas.current.isEmpty()) {
      setErrorMessage("Please provide a signature before saving.");
      return;
    }

    const dataUrl = sigCanvas.current.toDataURL(); // Get the base64 image
    setSignatureData(dataUrl); // Update state with signature image
    setErrorMessage(""); // Clear error message
    // setIsSignaturePadVisible(false); // Close the SignaturePad after saving
    setFormdata((preve) => {
      return {
        ...preve,
        signature: dataUrl,
      };
    });
  };

  const handleCloseSignaturePad = () => {
    setIsSignaturePadVisible(false); // Close the SignaturePad without saving
  };

  const clearSignature = () => {
    sigCanvas.current.clear();
    setSignatureData("");
    setErrorMessage(""); // Reset error message on clear
  };

  const steps = [
    {
      title: " Personal Information",
      content: (
        <div>
          {" "}
          {/* Form Inputs */}
          <div>
            <label className="font-semibold">Fullname:</label>
            <input
              type="text"
              name="name"
              className={`${
                !errors.name ? "mb-7" : "mb-0 border-danger"
              } w-full px-3 py-2  border  rounded-md outline-none`}
              placeholder="Enter Fullname"
              onChange={handleChange}
              value={formData.name}
            />
            {submitted && errors.name && (
              <div className="text-red-500 mb-1">{errors.name}</div>
            )}
          </div>
          {/*Email */}
          <div>
            <label className="font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              className={`${
                !errors.email ? "mb-7" : "mb-0 border-danger"
              } w-full px-3 py-2  border  rounded-md outline-none`}
              placeholder="Enter Email"
              onChange={handleChange}
              value={formData.email}
            />
            {submitted && errors.email && (
              <div className="text-red-500 mb-1">{errors.email}</div>
            )}
          </div>
          <div>
            <label className="font-semibold">Mobile:</label>
            <input
              type="text"
              name="mobile"
              className={`${
                !errors.mobile ? "mb-7" : "mb-0 border-danger"
              } w-full px-3 py-2  border  rounded-md outline-none`}
              placeholder="Enter Mobile"
              onChange={handleChange}
              value={formData.mobile}
            />
            {submitted && errors.mobile && (
              <div className="text-red-500 mb-3">{errors.mobile}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: " Visit Details",
      content: (
        <div>
          <div>
            <label className="font-semibold">Address:</label>
            <input
              type="text"
              name="address"
              className={`${
                !errors.address ? "mb-7" : "mb-0 border-danger"
              } w-full px-3 py-2  border  rounded-md outline-none`}
              placeholder="Enter Address"
              onChange={handleChange}
              value={formData.address}
            />
            {submitted && errors.address && (
              <div className="text-red-500 mb-3">{errors.address}</div>
            )}
          </div>

          <div>
            <label className="font-semibold">Visiting:</label>
            <Select
              className={`${
                !errors.visitingperson ? "mb-7" : "mb-0  border-danger"
              } w-full h-10 border rounded-md`}
              showSearch
              listHeight={200}
              onChange={handlePersonChange}
              placeholder="Select visiting person"
              optionFilterProp="label"
              value={formData.visitingperson}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={employeeOptions}
            />
            {submitted && errors.visitingperson && (
              <div className="text-red-500 mb-3">{errors.visitingperson}</div>
            )}
          </div>

          <div>
            <label className="font-semibold">Purpose of visit:</label>
            <Select
              className={`${
                !errors.visitingpurpose ? "mb-7" : "mb-0  border  border-danger"
              } w-full h-10 rounded-md custom-select`}
              // showSearch
              listHeight={200}
              value={formData.visitingpurpose}
              onChange={handlevisitingreason}
              placeholder="Select Purpose"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={purposevisitoptions}
            />
            {submitted && errors.visitingpurpose && (
              <div className="text-red-500 mb-3">{errors.visitingpurpose}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Verification",
      content: (
        <div>
          <div className=" flex flex-col ">
            <label className="font-semibold">Photo:</label>

            {!isCameraActive ? (
              <div>
                <button
                  type="button"
                  className=" btn btn-secondary w-1/3"
                  onClick={handleTakePhoto}
                >
                  Take Photo
                </button>
                {submitted && errors.photo && (
                  <div className="text-red-500 mb-3">{errors.photo}</div>
                )}
              </div>
            ) : (
              <div>
                {/* Webcam */}
                <div
                  className=" cursor-pointer  absolute z-50  ms-1"
                  style={{ cursor: "pointer" }}
                >
                  <MdOutlineFlipCameraIos
                    size={30}
                    className=" cursor-pointer"
                    onClick={handlecameraswap}
                  />
                </div>
                <Webcam
                  audio={false}
                  screenshotFormat="image/jpeg"
                  width="100%"
                  videoConstraints={{
                    facingMode: swapcamera ? "environment" : "user", // Front camera
                  }}
                  ref={webcamRef} // Attach ref to the webcam
                />

                {/* Capture Button */}
                <button
                  type="button"
                  className="btn btn-success mt-2 top-0 right-0"
                  onClick={handleCapture}
                >
                  Capture Photo
                </button>
              </div>
            )}
          </div>
          {photo && (
            <div className="mt-4">
              <h3>Captured Photo:</h3>
              <img src={photo} alt="Captured" className="w-full" />
            </div>
          )}

          <div className="mt-3">
            <label className="font-semibold">Signature:</label>{" "}
            {/* Button to open the SignaturePad */}
            {!isSignaturePadVisible ? (
              <div>
                {" "}
                <button
                  type="button"
                  onClick={handleOpenSignaturePad}
                  className="btn btn-secondary w-1/3 "
                >
                  Add Signature
                </button>
                {submitted && errors.signature && (
                  <div className="text-red-500 mb-3">{errors.signature}</div>
                )}
              </div>
            ) : (
              <div className="container-fluid w-full d-flex justify-content-center align-items-center p-3">
                <div className="card shadow-lg p-4 w-full">
                  <h2 className="text-center text-primary mb-4">Sign Here</h2>

                  <div className="d-flex h-60  justify-content-center mb-4">
                    <SignatureCanvas
                      ref={sigCanvas}
                      penColor="black"
                      canvasProps={{
                        className: "border   border-secondary rounded w-full",
                      }}
                    />
                  </div>

                  {/* Error message when signature is empty */}
                  {errorMessage && (
                    <div className="alert alert-danger text-center">
                      {errorMessage}
                    </div>
                  )}

                  <div className="d-flex justify-content-between w-full gap-2">
                    <button
                      onClick={clearSignature}
                      type="button"
                      className="btn btn-danger w-full   "
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveSignature}
                      className="btn btn-success w-full"
                    >
                      Save
                    </button>
                  </div>

                  {/* Close button */}
                  <div className="mt-3">
                    <button
                      onClick={handleCloseSignaturePad}
                      className="btn btn-secondary w-100"
                    >
                      Close
                    </button>
                  </div>

                  {/* Display the saved signature as an image if available */}
                  {signatureData && (
                    <div className="mt-4 text-center">
                      <h4 className="text-success">Signature Saved!</h4>
                      <img
                        src={signatureData}
                        alt="Saved Signature"
                        className="border rounded"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Conditional rendering of SignaturePad */}
            {/* Display the saved signature if available */}
            {signatureData && !isSignaturePadVisible && (
              <div>
                <h3>Signature:</h3>
                <img src={signatureData} alt="Saved Signature" />
              </div>
            )}
          </div>

          {/* Display Captured Photo */}

          <div className=" w-full flex flex-row gap-4">
            <div className=" btn btn-light w-full" onClick={handleClose}>
              cancel
            </div>
            {saveloader ? (
              <button
                type="button"
                disabled={true}
                className=" btn btn-primary w-full flex items-center "
              >
                Add visitor
                <Spin
                  indicator={
                    <LoadingOutlined spin className=" ms-2 text-white" />
                  }
                />
              </button>
            ) : (
              <button
                type="submit"
                className=" btn btn-primary w-full flex items-center "
              >
                Add Visitor
              </button>
            )}
          </div>
        </div>
      ),
    },
  ];
  // const { token } = theme.useToken();
  const next = () => {
    const valid = validateForm();
    setSubmitted(true);

    if (
      (current === 0 &&
        formData.name &&
        formData.email &&
        formData.mobile &&
        valid) ||
      (current === 1 &&
        formData.address &&
        formData.visitingpurpose &&
        formData.visitingperson &&
        valid) ||
      (current === 2 && formData.photo && formData.signature)
    ) {
      setCurrent(current + 1);
    } else {
      message.error("Please fill out all required fields!");
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  // const contentStyle = {
  // lineHeight: '260px',
  // textAlign: 'center',
  // color: token.colorTextTertiary,
  // backgroundColor: token.colorFillAlter,
  // borderRadius: token.borderRadiusLG,
  // border: `1px dashed ${token.colorBorder}`,
  // marginTop: 16,
  // };
  return (
    <div>
      <form
        onSubmit={handleAddvisitor}
        className="flex flex-col gap-3 lg:w-1/2 m-auto "
      >
        <Steps current={current} items={items} />
        <div>{steps[current].content}</div>
        <div
          // className="ml-96 sm:ml-44 md:ml-20 lg:ml-10"
          className={` flex flex-row  ${
            current > 0 ? "justify-between" : "justify-end"
          } `}
          style={{
            marginTop: 24,
          }}
        >
          {current > 0 && (
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => next()}
              //  htmlType="submit"
            >
              Next
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddVisitorPage;
