import axios from "axios";
import React, { useEffect, useState } from "react";

const Visitormodal = ({ id }) => {
  const [visitor, setVisitor] = useState([]);

  const Getvisitor = async () => {
    await axios
      .get(`http://192.168.1.27:8090/api/getvisitorbyid/${id}`)
      .then((response) => {
        setVisitor(response.data);
      });
  };

  useEffect(() => {
    Getvisitor();
  }, []);

  return (
    <div>
      <div>
        {visitor?.map((item) => (
          <div key={item._id}>
            {/* <h3>{item.name}</h3> */}
            <img src={item.photo} alt="visitor" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Visitormodal;
