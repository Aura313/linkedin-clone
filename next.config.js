const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
};
