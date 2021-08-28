import { Logger, LogLevel } from "./src/utils/logger";

Logger.setLogLevel(LogLevel.verbose);

Logger.value("Test value log.");
Logger.info("Test info log.");
Logger.warn("Test warning log.");
Logger.error("Test error log.");
Logger.success("Test success log.");
