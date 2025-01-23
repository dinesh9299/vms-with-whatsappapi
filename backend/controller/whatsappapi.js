const axios = require("axios");

async function Whatsappapi(req, res) {
  const apiUrl = "https://backend.api-wa.co/campaign/smartping/api/v2";
  const apiKey = process.env.API_KEY; // Ensure your API key is set in the .env file
  const { name, balance, threshold, destination } = req.body;

  // Input validation
  if (!name || !balance || !threshold || !destination) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: name, balance, threshold, or destination",
    });
  }

  // Prepare the request payload
  const requestData = {
    apiKey: apiKey,
    campaignName: "vms", // Campaign name, ensure this is correct
    destination: destination, // Dynamic phone number
    userName: "ganesh@brihaspathi.com", // Example username, ensure this is dynamic if necessary
    templateParams: [`${name}`, `${balance}`, `${threshold}`], // Dynamic message content
    tags: "", // Can be set if required, leave empty if not
    attributes: {
      name: name,
      balance: balance,
      threshold: threshold,
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

module.exports = Whatsappapi;
