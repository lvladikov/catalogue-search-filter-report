import { getDaysOfTheWeek, getMonthsOfTheYear } from "./date-and-time";

const getValueTextPairs = (arr) => {
  return arr.map((d) => ({ value: String(d).toLowerCase(), text: String(d) }));
};

export const months = getValueTextPairs(["ANY", ...getMonthsOfTheYear()]);

export const years = getValueTextPairs([
  "ANY",
  ...Array.from({ length: 12 }, (_, i) => 2019 + i), //years from 2019 to 2030
]);

export const telescopes = getValueTextPairs([
  "ANY",
  "DEMO TELESCOPE 1",
  "DEMO TELESCOPE 2",
  "DEMO TELESCOPE 3",
  "DEMO TELESCOPE 4",
  "DEMO TELESCOPE 5",
  "DEMO TELESCOPE 6",
  "DEMO TELESCOPE 7",
  "DEMO TELESCOPE 8",
  "DEMO TELESCOPE 9",
  "DEMO TELESCOPE 10",
]);

export const daysOfTheWeek = [
  ...getValueTextPairs(["ANY", ...getDaysOfTheWeek()]),
  //And two out of pattern exceptions
  { value: "weekday", text: "* Weekday (Mon-Fri)" },
  { value: "weekend", text: "* Weekend (Sat-Sun)" },
];

export const filterByTextTypeOptions = [
  { value: "title", text: "Title" },
  { value: "tScope", text: "Telescope" },
  { value: "detailsID", text: "Details ID" },
  { value: "cost", text: "Cost" },
  { value: "objType", text: "Object Type" },
  { value: "filters", text: "Filters" },
  { value: "summary", text: "Summary" },
  { value: "note", text: "Notes (Folder)" },
];

export const filterSortByTextTypeOptions = [
  { value: "__pubOnSortable", text: "Date/Time" },
  { value: "title", text: "Title" },
  { value: "detailsID", text: "Details ID" },
  { value: "cost", text: "Cost" },
  { value: "objType", text: "Object Type" },
  { value: "filters", text: "Filters" },
  { value: "__expTimeInSeconds", text: "Exposure Time" },
  { value: "__imgFramesLength", text: "Number of Images" },
  { value: "__coordsDec", text: "Coordinates - Dec" },
  { value: "__coordsRa", text: "Coordinates - Ra" },
  { value: "tScope", text: "Telescope" },
  { value: "grabbed", text: "Grabbed (with FITS)" },
  { value: "summary", text: "Summary" },
  { value: "note", text: "Notes (Folder)" },
];
