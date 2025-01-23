const axios = require("axios");

async function Ledcum(req, res) {
  const apiUrl = "https://backend.api-wa.co/campaign/smartping/api/v2";
  const apiKey = process.env.API_KEY; // Ensure your API key is set in the .env file
  const { destination } = req.body;

  // Input validation

  // Prepare the request payload
  const requestData = {
    apiKey: apiKey,
    campaignName: "led cum", // Campaign name, ensure this is correct
    destination: destination, // Dynamic phone number
    userName: "ganesh@brihaspathi.com", // Example username, ensure this is dynamic if necessary
    templateParams: ["https://vm.ltd/BRSPTI/DKJCuu"], // Dynamic message content
    tags: "", // Can be set if required, leave empty if not
    attributes: {
      name: link,
    },
  };

  try {
    // Send the POST request to the Smartping API
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Return response from the API to the frontend
    return res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response ? error.response.data : error.message
    );

    // Handle errors in the API call
    return res.status(500).json({
      success: false,
      message: "Error sending message",
      error: error.response ? error.response.data : error.message,
    });
  }
}

module.exports = Ledcum;
