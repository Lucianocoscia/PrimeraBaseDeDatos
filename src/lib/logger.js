import dotenv from "dotenv";
import pino from "pino";

dotenv.config();

const buildWarnLogger = () => {
  const warnLogger = pino("warn.log");

  warnLogger.level = "warn";

  return warnLogger;
};

const buildInfoLogger = () => {
  const infoLogger = pino();

  infoLogger.level = "info";

  return infoLogger;
};
const buildErrorLogger = () => {
  const errorLogger = pino("error.log");

  errorLogger.level = "error";

  return errorLogger;
};

let info = buildInfoLogger();
let warning = buildWarnLogger();
let error = buildErrorLogger();

const logger = { info, warning, error };

export default logger;
