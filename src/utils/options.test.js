import { getDaysOfTheWeek, getMonthsOfTheYear } from "./date-and-time";
import {
  months,
  years,
  telescopes,
  daysOfTheWeek,
  filterByTextTypeOptions,
  filterSortByTextTypeOptions,
} from "./options";

describe("options", () => {
  it("months should have the correct structure and values", () => {
    expect(months).toBeDefined();
    expect(Array.isArray(months)).toBe(true);
    expect(months[0]).toEqual({ value: "any", text: "ANY" });
    const expectedMonths = ["ANY", ...getMonthsOfTheYear()].map((month) => ({
      value: String(month).toLowerCase(),
      text: String(month),
    }));
    expect(months).toEqual(expectedMonths);
  });

  it("years should have the correct structure and values", () => {
    expect(years).toBeDefined();
    expect(Array.isArray(years)).toBe(true);
    expect(years[0]).toEqual({ value: "any", text: "ANY" });

    const expectedYears = [
      "ANY",
      ...Array.from({ length: 12 }, (_, i) => 2019 + i),
    ].map((year) => ({
      value: String(year).toLowerCase(),
      text: String(year),
    }));
    expect(years).toEqual(expectedYears);
  });

  it("telescopes should have the correct structure and values", () => {
    expect(telescopes).toBeDefined();
    expect(Array.isArray(telescopes)).toBe(true);
    expect(telescopes[0]).toEqual({ value: "any", text: "ANY" });

    const expectedTelescopes = [
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
    ].map((telescope) => ({
      value: String(telescope).toLowerCase(),
      text: String(telescope),
    }));
    expect(telescopes).toEqual(expectedTelescopes);
  });

  it("daysOfTheWeek should have the correct structure and values", () => {
    expect(daysOfTheWeek).toBeDefined();
    expect(Array.isArray(daysOfTheWeek)).toBe(true);
    expect(daysOfTheWeek[0]).toEqual({ value: "any", text: "ANY" });

    const expectedDaysOfTheWeek = [
      ...["ANY", ...getDaysOfTheWeek()].map((day) => ({
        value: String(day).toLowerCase(),
        text: String(day),
      })),
      { value: "weekday", text: "* Weekday (Mon-Fri)" },
      { value: "weekend", text: "* Weekend (Sat-Sun)" },
    ];
    expect(daysOfTheWeek).toEqual(expectedDaysOfTheWeek);
  });

  it("filterByTextTypeOptions should have the correct structure and values", () => {
    expect(filterByTextTypeOptions).toBeDefined();
    expect(Array.isArray(filterByTextTypeOptions)).toBe(true);
    expect(filterByTextTypeOptions).toEqual([
      { value: "title", text: "Title" },
      { value: "tScope", text: "Telescope" },
      { value: "detailsID", text: "Details ID" },
      { value: "cost", text: "Cost" },
      { value: "objType", text: "Object Type" },
      { value: "filters", text: "Filters" },
      { value: "summary", text: "Summary" },
      { value: "note", text: "Notes (Folder)" },
    ]);
  });

  it("filterSortByTextTypeOptions should have the correct structure and values", () => {
    expect(filterSortByTextTypeOptions).toBeDefined();
    expect(Array.isArray(filterSortByTextTypeOptions)).toBe(true);
    expect(filterSortByTextTypeOptions).toEqual([
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
    ]);
  });
});
