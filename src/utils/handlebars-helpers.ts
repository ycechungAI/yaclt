import { DateTime } from "luxon";

export const currentDateTimeHelper = (
  format: "ISODate" | "ISO" | "localeString" | string = "ISODate"
): string => {
  const now = DateTime.now();
  switch (format) {
    case "ISODate":
      return now.toISODate();
    case "ISO":
      return now.toISO();
    case "localeString":
      return now.toLocaleString();
    default:
      return now.toFormat(format);
  }
};

export const capitalizeHelper = (str: string): string =>
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

export const echoHelper = (str: string): string => str;
