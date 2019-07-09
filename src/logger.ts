import { createLogger, transports, format } from "winston";

const justMessageFormat = format.printf(({ message }) => {
  return message;
});

const logger = createLogger({
  level: process.env.NODE_ENV === "test" ? "warning" : "info",
  transports: [
    new transports.Console(),
  ],
  format: format.combine(
    format.colorize(),
    justMessageFormat
  )
});

export default logger;
