const CompanyProfile = require("../models/CompanyProfile");

// Function to create a company profile
const createCompanyProfile = async (
  userId,
  companyName,
  fleetSize,
  transaction
) => {
  if (!companyName || !fleetSize) {
    throw new Error(
      "Company name or fleet size is required for company registration"
    );
  }

  const existingCompany = await CompanyProfile.findOne({
    where: { company_name: companyName },
    transaction,
  });
  if (existingCompany) {
    throw new Error("Company name already exists");
  }

  await CompanyProfile.create(
    {
      user_id: userId,
      company_name: companyName,
      fleet_size: fleetSize,
    },
    { transaction }
  );
};

module.exports = createCompanyProfile;
