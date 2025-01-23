const mongoose = require("mongoose");
const visitorModel = require("../models/VisitorModel");

async function Updatecheckin(req, res) {
  try {
    // Get visitor ID from params
    const visitorId = req.params.id;

    // Check if the visitor ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(visitorId)) {
      return res.status(400).send("Invalid visitor ID");
    }

    // Update the visitor with the new checkin time and set checkin to true
    const result = await visitorModel.updateOne(
      { _id: visitorId }, // Find visitor by ID
      { 
        $set: {
          checkinTime: new Date(), // Set checkinTime to the current time
          checkin: true,
          status: "checked-in",
        },
      }
    );

    // Handle response based on update result
    if (result.nModified > 0) {
      res.status(200).send("Check-in updated successfully");
    } else if (result.n === 0) {
      // If no visitor was found with the given ID
      res.status(404).send("Visitor not found");
    } else {
      // If the visitor exists but was already checked-in
      res
        .status(200)
        .send("Visitor already checked-in, but check-in time updated");
    }
  } catch (error) {
    console.error("Error updating check-in:", error);
    res.status(500).send("Server Error");
  }
}

module.exports = Updatecheckin;
