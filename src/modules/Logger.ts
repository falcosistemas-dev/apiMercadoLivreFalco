import { appendFileSync } from "fs";
import { join } from "path";

type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

const logFile = join("./app.log");

function log(level: LogLevel, message: string, context?: any) {
  const timestamp = new Date().toISOString();
  const formatted = `[${timestamp}] [${level}] ${message}`;

  if (context) {
    console.log(formatted, context);
  } else {
    console.log(formatted);
  }

  appendFileSync(logFile, formatted+'\n', { encoding: "utf-8" });
}

export const Logger = {
  info: (msg: string, ctx?: any) => log("INFO", msg, ctx),
  warn: (msg: string, ctx?: any) => log("WARN", msg, ctx),
  error: (msg: string, ctx?: any) => log("ERROR", msg, ctx),
  debug: (msg: string, ctx?: any) => log("DEBUG", msg, ctx),
};