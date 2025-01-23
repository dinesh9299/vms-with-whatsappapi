import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  DatePicker,
  Input,
  InputGroup,
  Loader,
  Modal,
  Placeholder,
} from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import { Image, Select } from "antd";
import axios from "axios";
import Download from "../../src/images/office.png";

import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slice";
import { useNavigate } from "react-router-dom";

import * as XLSX from "xlsx"; // Import the xlsx library
import Visitormodal from "./Visitormodal";
import { CloseOutlined } from "@ant-design/icons";
import logo from "./../images/new logo blue.png";
const Allvisitorspage = ({ getload }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [onChangepurpose, setOnChangepurpose] = useState("");
  const [cookies, setCookies] = useCookies(["token"]);
  const [latestpersons, setLatestpersons] = useState([]);
  const [searchTerm, setSearchitem] = useState("");
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [visitorid, setVisitorid] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = (value) => {
    setVisitorid(value);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!cookies.token) {
      navigate("/signin");
      return;
    }

    // Fetch user data
    const GetUser = async () => {
      const response = await axios.post(
        "http://192.168.1.27:8090/api/getuser",
        {
          token: cookies.token,
        }
      );
      const getuserData = response.data;
      if (getuserData.data.message === "Invalid token") {
        alert("Invalid token");
        navigate("/signin");
      }
      dispatch(setUser(getuserData.data));
    };
    GetUser();
  }, [cookies.token, navigate, dispatch]);

  const getvisitors = async () => {
    setLoading(true); // Set loading state to true when starting the fetch
    await axios
      .get("http://192.168.1.27:8090/api/getvisitors")
      .then((response) => {
        setVisitors(response.data);
        setLoading(false); // Set loading state to false when data is fetched
      });
  };

  useEffect(() => {
    getvisitors();
  }, [getload]);

  // const [monthselect, setMonthselect] = useState(10);

  // // Function to extract the month from the `createdAt` date string
  // const getMonthFromDate = (dateString) => {
  //   const date = new Date(dateString); // Convert ISO string to Date object
  //   return date.getMonth(); // Get the month (0 for January, 1 for February, ..., 10 for November)
  // };

  // // Filtering visitors based on selected month
  // const monthfiltered = visitors.filter(
  //   (person) => getMonthFromDate(person.createdAt) === monthselect
  // );

  const [monthselect, setMonthselect] = useState(null); // Example: November (0-based index)
  const [yearselect, setYearselect] = useState(null); // Example: Year 2024

  // Function to extract the month and year from the `createdAt` date string
  const getMonthAndYearFromDate = (dateString) => {
    const date = new Date(dateString); // Convert ISO string to Date object
    return {
      month: date.getMonth(), // Get the month (0 for January, 1 for February, ..., 11 for December)
      year: date.getFullYear(), // Get the year (e.g., 2024)
    };
  };

  const handleCalendar = (value) => {
    if (value) {
      const selected = new Date(value);

      setMonthselect(selected.getMonth());
      setYearselect(selected.getFullYear());
    } else {
      setMonthselect(null);
      setYearselect(null);
    }
  };

  const filteredVisitors = useMemo(() => {
    let filtered = visitors;
    if (searchTerm) {
      filtered = filtered.filter((person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (onChangepurpose) {
      filtered = filtered.filter(
        (person) => person.visitingpurpose === onChangepurpose
      );
    }

    if (monthselect && yearselect) {
      filtered = filtered.filter((person) => {
        const { month, year } = getMonthAndYearFromDate(person.createdAt);
        return month === monthselect && year === yearselect;
      });
    }

    return filtered;
  }, [searchTerm, onChangepurpose, visitors, monthselect, yearselect]);

  // console.log("monthfiltered", monthfiltered);

  useEffect(() => {
    setLatestpersons(filteredVisitors);
  }, [filteredVisitors]);

  const handleQuerychange = (value) => {
    setSearchitem(value);
  };

  const onChangepurposeHandler = (value) => {
    setOnChangepurpose(value);
  };

  const visitingpurposeoptions = [
    { value: "Personal", label: "Personal" },
    { value: "Business", label: "Business" },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if minutes are < 10

    const formattedDate = `${date.toLocaleDateString()} ${formattedHours}:${formattedMinutes} ${ampm}`;

    return formattedDate;
  };

  // Function to download data as Excel
  const downloadExcel = () => {
    const data = latestpersons.map((visitor) => ({
      Name: visitor.name,
      Mobile: visitor.mobile,
      Status:
        !visitor.checkin && !visitor.checkout
          ? "Pending"
          : visitor.checkin && !visitor.checkout
          ? "Checked-in"
          : "Checked-out",
      "Visiting Purpose": visitor.visitingpurpose,
      "Check-in Time": visitor.checkinTime
        ? formatDate(visitor.checkinTime)
        : "--",
      "Check-out Time": visitor.checkouttime
        ? formatDate(visitor.checkouttime)
        : "--",
      "Visiting Person": visitor.visitingperson,
      "Created at": visitor.createdAt,
      "Created By": visitor.createdby,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Visitors");

    // Generate download link
    const excelFile = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "binary",
    });
    const buffer = new ArrayBuffer(excelFile.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < excelFile.length; i++) {
      view[i] = excelFile.charCodeAt(i) & 0xff;
    }

    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "visitors.xlsx";
    link.click();
  };

  const disableFutureDates = (date) => {
    const today = new Date();
    return date > today; // Disable dates greater than today
  };

  const handlePrint = (employee) => {
    // Create a temporary div for printing
    const printContent = `
    <fieldset>
   <legend>
      <img src="${logo}" width=200px; height=100px; />
   </legend>
   <div style="padding: 20px; font-family: Arial, sans-serif; display: flex; flex-direction: column; gap: 30px;">
    <div>
      <img src="${
        employee.photo
      }" width="180" height="200" style="border-radius: 5px; border:1px solid black" />
    </div>
    <div><strong>Name:</strong> ${employee.name}</div>
    <div><strong>Mobile:</strong> ${employee.mobile}</div>
    <div><strong>Email:</strong> ${employee.email}</div>
    <div><strong>Status:</strong> ${
      !employee.checkin && !employee.checkout
        ? "Pending"
        : employee.checkin && !employee.checkout
        ? "Checked-in"
        : "Checked-out"
    }</div>
    <div><strong>Visiting Purpose:</strong> ${employee.visitingpurpose}</div>
    <div><strong>Check-in Time:</strong> ${
      employee.checkinTime ? formatDate(employee.checkinTime) : "--"
    }</div>
    <div><strong>Check-out Time:</strong> ${
      employee.checkouttime ? formatDate(employee.checkouttime) : "--"
    }</div>
    <div><strong>Visiting Person:</strong> ${employee.visitingperson}</div>
    <div><strong>Created At:</strong> ${formatDate(employee.createdAt)}</div>
    <div><strong>Created By:</strong> ${employee.createdby}</div>
    <div style=" display: flex; justify-content: flex-end;">
        <div>
        <div><strong>Signature</strong></div>
        <img src=${employee.signature} width="150"  height="70"/></div>
    </div>
  </div>
</fieldset>

    `;

    // Create an iframe or a new window to contain the print content
    const printWindow = document.createElement("iframe");
    printWindow.style.position = "absolute";
    printWindow.style.width = "0px";
    printWindow.style.height = "0px";
    printWindow.style.border = "none";
    document.body.appendChild(printWindow);

    const doc = printWindow.contentWindow.document;
    doc.open();
    doc.write(printContent);
    doc.close();

    // Trigger the print dialog
    printWindow.contentWindow.focus();
    printWindow.contentWindow.print();

    // Optionally, remove the iframe after printing
    setTimeout(() => {
      document.body.removeChild(printWindow);
    }, 1000);
  };

  return (
    <div>
      <div className="h-full w-full lg:px-24 md:px-2 sm:px-2 min-h-screen ">
        <div className="px-2">
          <h1 className="font-bold text-2xl mt-4">Visitors history</h1>
        </div>

        {/* Search Input */}
        <div className="lg:flex lg:flex-row lg:items-center lg:justify-between w-full mt-5 px-2 ">
          <div className="flex flex-col md:flex-row lg:flex-row w-full mt-16 lg:mt-1 gap-2 ">
            <div className="lg:w-4/6 md:w-full sm:w-full ">
              <InputGroup style={{ width: "100%", height: 40 }}>
                <InputGroup.Addon className="bg-slate-100">
                  <SearchIcon />
                </InputGroup.Addon>
                <Input
                  className="bg-slate-100 w-full focus:outline-none"
                  placeholder="Search Visitors..."
                  onChange={handleQuerychange}
                />
              </InputGroup>
            </div>

            <div className="w-full gap-2 flex items-center flex-row lg:w-2/6">
              <DatePicker
                format="yyyy-MM"
                editable={true}
                onChange={handleCalendar}
                className=" w-full"
                shouldDisableDate={disableFutureDates}
                // disabledDate={disableFutureDates}
              />
              <Select
                placeholder="Purpose"
                optionFilterProp="label"
                onChange={onChangepurposeHandler}
                options={visitingpurposeoptions}
                className="h-10 w-full"
                allowClear={{ clearIcon: <CloseOutlined /> }}
              />
              <div className="">
                <img
                  src={Download}
                  alt=" download"
                  onClick={downloadExcel}
                  width={"90px"}
                  height={"90px"}
                  className=" cursor-pointer"
                ></img>
              </div>
            </div>
          </div>
        </div>
        {/* Download Excel Button */}
        {/* <div className="mt-4">
          <img
            src={Download}
            alt=" download"
            onClick={downloadExcel}
            width={"50px"}
            height={"5s0px"}
          ></img>
        </div> */}

        {/* Loading indicator */}
        {loading ? (
          <div className=" relative">
            <Placeholder.Paragraph rows={8} />
            <Loader center content="loading" />
          </div>
        ) : (
          <div className="mt-3 pb-5 w-full overflow-x-auto px-2">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    Profile
                  </th>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    Mobile
                  </th>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    Visiting Purpose
                  </th>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    Check-in Time
                  </th>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    Check-out Time
                  </th>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    Visiting person
                  </th>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    Created at
                  </th>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    Created By
                  </th>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {latestpersons?.length > 0 ? (
                  latestpersons
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((employee) => (
                      <tr key={employee._id} className="border-b">
                        <td className="px-4 py-2 whitespace-nowrap">
                          {/* <img
                            alt="profile"
                            src={employee.photo}
                            className="w-12 h-12 object-cover rounded-full hover:cursor-pointer "
                          /> */}
                          <Image
                            src={employee.photo}
                            alt="Image"
                            width="250"
                            preview
                          />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {employee.name}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {employee.mobile}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {!employee.checkin && !employee.checkout ? (
                            <div className="text-sm inline-block bg-orange-200 py-1 px-2 rounded-full">
                              Pending
                            </div>
                          ) : employee.checkin && !employee.checkout ? (
                            <div className="text-sm inline-block bg-cyan-300 py-1 px-2 rounded-full">
                              Checked-in
                            </div>
                          ) : (
                            <div className="text-sm inline-block bg-red-300 py-1 px-2 rounded-full">
                              Checked-out
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {employee.visitingpurpose}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {employee.checkinTime
                            ? formatDate(employee.checkinTime)
                            : "--"}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {employee.checkouttime
                            ? formatDate(employee.checkouttime)
                            : "--"}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {employee.visitingperson}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {formatDate(employee.createdAt)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {employee.createdby}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <button
                            onClick={() => handlePrint(employee)}
                            className="text-blue-500 hover:underline"
                          >
                            Print
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-center px-4 py-2 text-lg text-gray-500"
                    >
                      No visitors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/*Modal for  visitor details */}

      <Modal className=" p-0" open={open} onClose={handleClose}>
        <Visitormodal id={visitorid} />
        {/* <Modal.Body>
          <Visitormodal id={visitorid} />
        </Modal.Body> */}
        <Modal.Footer>
          {/* <Button onClick={handleClose} appearance="primary">
            close
          </Button> */}
          {/* <Button onClick={handleClose} appearance="subtle">
            Close
          </Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Allvisitorspage;
