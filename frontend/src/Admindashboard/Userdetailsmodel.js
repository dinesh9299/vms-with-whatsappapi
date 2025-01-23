import { Image } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Userdetailsmodel = ({ id }) => {
  const [user, setUser] = useState({});

  const getUSerbyid = async () => {
    const response = await axios.get(
      `http://192.168.1.27:8090/api/getuserbyprimary/${id}`
    );

    setUser(response.data.data);
  };

  useEffect(() => {
    getUSerbyid();
  }, [id]);

  return (
    <div className=" ">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <img
            src={user.profile}
            alt="profile"
            style={{ height: "150px", width: "170px" }}
            className=" rounded-lg"
          />
        </div>
        <div className="flex flex-row gap-2">
          <div className="text-gray-500">Employee Id :</div>
          <div className="rs-text-semibold">{user.empid}</div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="text-gray-500">Name :</div>
          <div className="rs-text-semibold">{user.name}</div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="text-gray-500">Mobile :</div>
          <div className="rs-text-semibold">{user.mobile}</div>
        </div>

        <div className="flex flex-row gap-2">
          <div className="text-gray-500">Email :</div>
          <div className="rs-text-semibold">{user.email}</div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="text-gray-500">Position :</div>
          <div className="rs-text-semibold">{user.position}</div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="text-gray-500">Role :</div>
          <div className="rs-text-semibold">{user.role}</div>
        </div>
      </div>
    </div>
  );
};

export default Userdetailsmodel;
