export const combineCountryCodeWithPhoneNumber = (
  countryCode: string,
  phoneNumber: string
): string => {
  return countryCode + phoneNumber;
};

export const combineDate = (
  day: string,
  month: string,
  year: string
): string => {
  const monthNumber = parseInt(month, 10);
  const stringMonthNumber =
    monthNumber < 10 ? `0${monthNumber}` : `${monthNumber}`;
  const stringDay = parseInt(day, 10) < 10 ? `0${day}` : day;
  return `${year}-${stringMonthNumber}-${stringDay}`;
};

export const getNearestDateOfWeekday = (targetDay: string): string => {
  // List of all weekdays in order
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Get today's date
  const today = new Date();

  // Get today's weekday index (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const todayIndex = today.getDay();

  // Find the target weekday index
  const targetIndex = weekdays.indexOf(targetDay);

  if (targetIndex === -1) {
    throw new Error("Invalid weekday name. Please provide a valid weekday.");
  }

  // Calculate the difference in days between today and the target weekday
  let difference = targetIndex - todayIndex;

  // If the target day is earlier in the week, move to the next week
  if (difference < 0) {
    difference += 7;
  }

  // Add the difference to today's date
  const resultDate = new Date(today);
  resultDate.setDate(today.getDate() + difference);

  // Format the result date as YYYY-MM-DD
  const formattedDate = resultDate.toISOString().split("T")[0]; // YYYY-MM-DD format

  return formattedDate;
};
