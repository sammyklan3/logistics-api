const DriverProfile = require("../models/DriverProfile");

// Function to create a driver profile
const createDriverProfile = async (
  userId,
  { licenseNumber, vehicleType, vehicleCapacity, experienceYears, transaction }
) => {
  if (!licenseNumber || !vehicleType || !vehicleCapacity || !experienceYears) {
    throw new Error("All fields are required for driver registration");
  }

  const existingDriver = await DriverProfile.findOne({
    where: { license_number: licenseNumber },
    transaction,
  });
  if (existingDriver) {
    throw new Error("License number already exists");
  }

  await DriverProfile.create(
    {
      user_id: userId,
      license_number: licenseNumber,
      vehicle_type: vehicleType,
      vehicle_capacity: vehicleCapacity,
      experience_years: experienceYears,
    },
    { transaction }
  );
};

module.exports = createDriverProfile;
