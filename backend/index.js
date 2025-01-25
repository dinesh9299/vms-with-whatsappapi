const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const router = require("./routes");
const cookieParser = require("cookie-parser");

const app = express();
const corsOptions = {
  origin: "*", // Frontend URL
  credentials: true, // Allow cookies to be sent with requests
};

app.use(cors(corsOptions)); // Enable CORS with credentials

const PORT = process.env.PORT;
app.use(express.json({ limit: "50mb" })); // Increase limit for JSON payloads
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.use("/api", router);

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("Connected to database");
  });
});
