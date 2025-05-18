export const getDaysOfTheWeek = (sundayBased = false) =>
  Array.from({ length: 7 }, (_, i) =>
    new Date(
      new Date().getFullYear(),
      0,
      sundayBased ? i - 2 : i - 1
    ).toLocaleDateString("en-GB", {
      weekday: "long",
    })
  );

export const getMonthsOfTheYear = () =>
  Array.from({ length: 12 }, (_, i) =>
    getMonthFromDate(new Date(new Date().getFullYear(), i, 1))
  );

export const getMonthFromDate = (date) =>
  date?.toLocaleString("default", {
    month: "long",
  });

export const getYearFromDate = (date) => date?.getFullYear();

export const getDayOfWeekFromDate = (date) => {
  const days = getDaysOfTheWeek(true); //Sunday based to match getDay
  const dayIndex = date.getDay(); // Get the number (0-6)
  return days[dayIndex]; // Use the number to get the name from the array
};

export const getCurrentMonthIndex = () => new Date().getMonth(); // Get current month (0-11)

export const getCurrentYear = () => getYearFromDate(new Date()); // Get current year

export const smartTime = (inputText) => {
  //Converts text input that describes time im days, hours minutes and seconds, into seconds
  let timeInSeconds = 0;

  inputText.split(" ").forEach((t) => {
    const tLC = t?.toLowerCase();
    if (tLC.includes("d") || tLC.includes("day"))
      timeInSeconds +=
        24 *
        60 *
        60 *
        parseInt(tLC.replace("d", "").replace("days", "").replace("day", ""));
    if (tLC.includes("h") || tLC.includes("hour"))
      timeInSeconds +=
        60 *
        60 *
        parseInt(tLC.replace("h", "").replace("hours", "").replace("hour", ""));
    if (tLC.includes("m") || tLC.includes("minute") || tLC.includes("min"))
      timeInSeconds +=
        60 *
        parseInt(
          tLC
            .replace("m", "")
            .replace("minutes", "")
            .replace("minute", "")
            .replace("mins", "")
            .replace("min", "")
        );
    if (tLC.includes("s") || tLC.includes("second") || tLC.includes("sec"))
      timeInSeconds += parseInt(
        tLC
          .replace("s", "")
          .replace("seconds", "")
          .replace("second", "")
          .replace("secs", "")
          .replace("sec", "")
      );
  });

  return timeInSeconds;
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getCurrentTimeFormatted = (
  date = new Date(),
  formatType = "readable" // also available: "sortable"
) => {
  // Get date components
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() is 0-indexed (0=Jan, 11=Dec)
  const year = date.getFullYear();

  // Get time components
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  // Pad components to ensure two digits for DD, MM, hh, ss
  const paddedDay = String(day).padStart(2, "0");
  const paddedMonth = String(month).padStart(2, "0");
  const paddedHours = String(hours).padStart(2, "0");
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  // Pad milliseconds to ensure three digits for ms
  const paddedMilliseconds = String(milliseconds).padStart(3, "0");

  // DD-MM-YYYY hh:mm:ss:ms format
  const formattedTime =
    formatType === "readable"
      ? `${paddedDay}-${paddedMonth}-${year} ${paddedHours}:${paddedMinutes}:${paddedSeconds}:${paddedMilliseconds}`
      : /* "sortable" */ `${year}${paddedMonth}${paddedDay}${paddedHours}${paddedMinutes}${paddedSeconds}${paddedMilliseconds}`; //used in __pubOnSortable
  return formattedTime;
};

export const formatTimeFromSeconds = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
    days ? String(days).padStart(2, "0") + "d" : "",
    hours ? String(hours).padStart(2, "0") + "h" : "",
    minutes ? String(minutes).padStart(2, "0") + "m" : "",
    String(secs).padStart(2, "0") + "s",
  ]
    .filter(Boolean)
    .join(" ");
};
