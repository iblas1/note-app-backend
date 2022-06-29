require("dotenv").config();

const PORT = process.env.PORT;
const NOTEMONGODB_URI = process.env.NOTEMONGODB_URI;

module.exports = {
  PORT,
  NOTEMONGODB_URI,
};
