import dotenv from "dotenv";
dotenv.config();
import "../utils/load_keys";
const config = require('../DB');
import { jest } from "@jest/globals";
jest.setTimeout(10000);

// Setup for mongo to connect to 'process.env.TEST_MONGO_URL' for tests.
process.env.TEST_MONGO_URL = (
  config.DB_URL_PREFIX +
  config.DB_AUTH_DETAILS +
  config.DB_HOSTNAME +
  config.TEST_DB_NAME );
