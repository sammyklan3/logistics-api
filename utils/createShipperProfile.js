const ShipperProfile = require("../models/ShipperProfile");

// Function to create a shipper profile
const createShipperProfile = async (userId, companyName, transaction) => {
  if (!companyName) {
    throw new Error("Company name is required for shipper registration");
  }

  await ShipperProfile.create(
    {
      user_id: userId,
      company_name: companyName,
    },
    { transaction }
  );
};

module.exports = createShipperProfile;
