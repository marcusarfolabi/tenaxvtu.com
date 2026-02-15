import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import updateLocale from "dayjs/plugin/updateLocale";

// Extend dayjs with necessary plugins
dayjs.extend(calendar);
dayjs.extend(updateLocale);

// Customize the calendar output to match your brand style
dayjs.updateLocale("en", {
  calendar: {
    lastDay: "[Yesterday] h:mm A",
    sameDay: "[Today] h:mm A",
    nextDay: "[Tomorrow] h:mm A",
    lastWeek: "ddd h:mm A", // e.g., Thur 7:30 AM
    sameElse: "Do dddd, MMMM 'YY", // e.g., 13th Friday, July '26
  },
});

/**
 * Formats a date string into a human-readable activity format
 * @param date The date string from the API
 */
export const formatActivityDate = (date: string | Date) => {
  if (!date) return "";
  
  return dayjs(date).calendar();
};

/**
 * Basic time formatter for simple displays
 */
export const formatTime = (date: string | Date) => {
  return dayjs(date).format("h:mm A");
};