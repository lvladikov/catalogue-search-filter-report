const fs = require("fs");
const path = require("path");

const doesFolderExist = (pathToCheckAgainst, folderName) => {
  // Construct the full path by joining the base path and the folder name
  const fullPath = path.join(pathToCheckAgainst, folderName);

  //   console.log(`fullPath: ${fullPath}`);

  try {
    // Use fs.accessSync to synchronously check if the path exists.
    // fs.constants.F_OK checks if the file/directory is visible to the process.
    fs.accessSync(fullPath, fs.constants.F_OK);

    // If accessSync() does not throw an error, the folder exists
    return true;
  } catch (error) {
    // If accessSync() throws an error, check if it's specifically 'ENOENT' (Entry Not Found)
    if (error.code === "ENOENT") {
      // The folder does not exist at the specified path
      return false;
    } else {
      // For any other error, re-throw it as it's an unexpected problem.
      console.error(`Error checking path ${fullPath}: ${error.message}`);
      throw error;
    }
  }
};

const doesFolderExistPromisified = (pathToCheckAgainst, folderName) => {
  return new Promise((resolve, reject) => {
    try {
      // Call the synchronous function inside the Promise executor
      const exists = doesFolderExist(pathToCheckAgainst, folderName);
      // Resolve the promise with the result of the synchronous function
      resolve(exists);
    } catch (error) {
      // If the synchronous function threw an error, reject the promise
      reject(error);
    }
  });
};

exports.doesFolderExist = doesFolderExistPromisified;

const getDaysOfTheWeek = (sundayBased = false) =>
  Array.from({ length: 7 }, (_, i) =>
    new Date(
      new Date().getFullYear(),
      0,
      sundayBased ? i - 2 : i - 1
    ).toLocaleDateString("en-GB", {
      weekday: "long",
    })
  );
exports.getDaysOfTheWeek = getDaysOfTheWeek;

const getDayOfWeekFromDate = (date) => {
  const days = getDaysOfTheWeek(true); //Sunday based to match getDay
  const dayIndex = date.getDay(); // Get the number (0-6)
  return days[dayIndex]; // Use the number to get the name from the array
};
exports.getDayOfWeekFromDate = getDayOfWeekFromDate;

const getMonthFromDate = (date) =>
  date?.toLocaleString("default", {
    month: "long",
  });
exports.getMonthFromDate = getMonthFromDate;

const getYearFromDate = (date) => date?.getFullYear();
exports.getYearFromDate = getYearFromDate;

const smartTime = (inputText) => {
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
exports.smartTime = smartTime;

const trimText = (text = "", maxLength = text.length, elipsisText = "...") =>
  text.length > maxLength ? text.slice(0, maxLength) + elipsisText : text;

exports.trimText = trimText;

const zeroPad = (num, minDigits) => String(num).padStart(minDigits, "0");

exports.zeroPad = zeroPad;

const getFormattedTimestamp = () => {
  const now = new Date();

  const pad = (num) => zeroPad(num, 2); // Ensures zero padding

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1); // Months are 0-based
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `${year}${month}${day}-${hours}${minutes}${seconds}-`;
};
exports.getFormattedTimestamp = getFormattedTimestamp;

const deleteFileIfExists = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err) => {
      if (err) {
        // If stat errors
        if (err.code === "ENOENT") {
          // File not found, resolve as successful (nothing to delete)
          console.log(`File not found: ${filePath}`);
          resolve(false); // Indicate that deletion didn't happen because file wasn't there
        } else {
          // Other error checking file, reject the promise
          console.error(`Error checking file ${filePath}:`, err);
          reject(err); // Reject with the actual error
        }
      } else {
        // File exists, proceed to delete
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            // Error deleting file, reject the promise
            console.error(`Error deleting file ${filePath}:`, unlinkErr);
            reject(unlinkErr); // Reject with the deletion error
          } else {
            // Successfully deleted
            console.log(`Successfully deleted: ${filePath}`);
            resolve(true); // Indicate successful deletion
          }
        });
      }
    });
  });
};

exports.deleteFileIfExists = deleteFileIfExists;
