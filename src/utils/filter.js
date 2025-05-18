import {
  getDayOfWeekFromDate,
  getMonthFromDate,
  getYearFromDate,
  getCurrentTimeFormatted,
  smartTime,
} from "./date-and-time";

import { splitWordsAndNumbers } from "./text";

export const getFilteredData = ({
  rawData,
  filterByText,
  filterByTextType,
  filterExactOrPartial,
  selectedTelescope,
  filterSortByTextType,
  filterSortByDescOrAsc,
  selectedYear,
  selectedMonth,
  selectedDayOfTheWeek,
  filterStartAt,
  filterLimit,
  setObsMatched,
}) => {
  let filteredData = [];

  const filterByTextMatchArray = [];

  if (filterByText.indexOf("||") > -1) {
    //We have multiple search options, separated by ||
    //Build an array in this case
    filterByText
      .split("||")
      .forEach((s) => filterByTextMatchArray.push(s.trim()));
  } else {
    filterByTextMatchArray.push(filterByText); //Even if one value push it as the only element of the array
  }

  for (let obs of rawData) {
    //Fallbacks for missing data fields - needed for both the derived values and the sorting to work in case of missing data
    obs.coords = obs.hasOwnProperty("coords")
      ? obs.coords
      : { dec: "", ra: "" };
    obs.cost = obs.hasOwnProperty("cost") ? obs.cost : 0;
    obs.detailsID = obs.hasOwnProperty("detailsID") ? obs.detailsID : "";
    obs.expTime = obs.hasOwnProperty("expTime") ? obs.expTime : "0min";
    obs.filters = obs.hasOwnProperty("filters") ? obs.filters : "";
    obs.grabbed = obs.hasOwnProperty("grabbed") ? obs.grabbed : false;
    obs.imagePath = obs.hasOwnProperty("imagePath") ? obs.imagePath : "";
    obs.imgFrames = obs.hasOwnProperty("imgFrames") ? obs.imgFrames : [];
    obs.note = obs.hasOwnProperty("note") ? obs.note : "";
    obs.objType = obs.hasOwnProperty("objType") ? obs.objType : "";
    obs.processed = obs.hasOwnProperty("processed") ? obs.processed : false;
    obs.pubOn = obs.hasOwnProperty("pubOn") ? obs.pubOn : "Jan 1 1970";
    obs.summary = obs.hasOwnProperty("summary") ? obs.summary : "";
    obs.tScope = obs.hasOwnProperty("tScope") ? obs.tScope : "";
    obs.title = obs.hasOwnProperty("title") ? obs.title : "";

    //Additional derived fields
    obs.__pubOnYear = getYearFromDate(new Date(obs.pubOn));
    obs.__pubOnMonth = getMonthFromDate(new Date(obs.pubOn));
    obs.__pubOnDOW = getDayOfWeekFromDate(new Date(obs.pubOn));
    obs.__pubOnSortable = getCurrentTimeFormatted(
      new Date(obs.pubOn),
      "sortable"
    );
    obs.__expTimeInSeconds = smartTime(obs.expTime);
    obs.__imgFramesLength = obs.imgFrames.length;
    obs.__coordsDec = obs.coords.dec;
    obs.__coordsRa = obs.coords.ra;

    let filterByTextMatchCheck =
      filterExactOrPartial === "P"
        ? filterByTextMatchArray.some((s) =>
            obs[filterByTextType]
              ?.toString()
              .trim()
              ?.toLowerCase()
              .includes(s?.toString().trim()?.toLowerCase())
          )
        : filterByTextMatchArray.some(
            (s) =>
              obs[filterByTextType]?.toString().trim()?.toLowerCase() ===
              s?.toString().trim()?.toLowerCase()
          );

    //Special case - 'empty'
    if (
      filterByTextMatchArray.length === 1 &&
      filterByTextMatchArray[0] === "empty"
    ) {
      filterByTextMatchCheck = obs[filterByTextType] === "";
    }

    //Special case - 'mismatch'
    if (
      filterByTextMatchArray.length === 1 &&
      filterByTextMatchArray[0] === "mismatch"
    ) {
      //Compare the title with the rest of the fields
      filterByTextMatchCheck = false;

      //Ignore Observations with Empty Notes
      if (obs.note?.trim() !== "") {
        //Check if any or all words in the title are part of the note field
        const titleWords = splitWordsAndNumbers(obs.title.toLowerCase())
          .join(" ")
          .split(" ");
        const titleJustWords = obs.title //for cases llike CED 106C where we don't want 106 and C split
          .toLowerCase()
          .split(" ");

        const noteWords = obs.note.toLowerCase().split("-");

        const summaryWords = (
          obs.summary.toLowerCase().replace(/,/gi, " ").split(" ") || []
        ).filter(
          (word) =>
            word !== "the" && word !== "an" && word !== "and" && word !== "of"
        ); // Remove certain common words
        const titleWordsSet = new Set([...titleWords, ...titleJustWords]);
        const noteWordsSet = new Set(noteWords);
        const summaryWordsSet = new Set(summaryWords);

        const titleWordsSetIntersection = [...titleWordsSet].filter((word) =>
          noteWordsSet.has(word)
        );

        const titleWordsSummarySetIntersection = [...titleWordsSet].filter(
          (word) => summaryWordsSet.has(word)
        );

        if (titleWordsSetIntersection.length < 2) {
          //Too few words in common
          filterByTextMatchCheck = true;
        }

        //Only for the note match failed ones, check also in summary
        if (filterByTextMatchCheck) {
          if (
            titleWordsSummarySetIntersection.length < 2 //higher match expected in summary
          ) {
            //Too few words in common
            filterByTextMatchCheck = true;
          } else {
            filterByTextMatchCheck = false;
          }
        }
      }
    }

    //Big filter code
    if (
      !(
        (filterByText !== "" && !filterByTextMatchCheck) ||
        (selectedTelescope !== "any" &&
          !obs.tScope
            ?.trim()
            ?.toLowerCase()
            .includes(selectedTelescope.trim()?.toLowerCase())) ||
        (selectedYear !== "any" &&
          !obs.__pubOnYear
            ?.toString()
            ?.trim()
            ?.toLowerCase()
            .includes(selectedYear.trim()?.toLowerCase())) ||
        (selectedMonth !== "any" &&
          !obs.__pubOnMonth
            ?.trim()
            ?.toLowerCase()
            .includes(selectedMonth.trim()?.toLowerCase())) ||
        (selectedDayOfTheWeek !== "any" &&
          selectedDayOfTheWeek !== "weekday" &&
          selectedDayOfTheWeek !== "weekend" &&
          !obs.__pubOnDOW
            ?.trim()
            ?.toLowerCase()
            .includes(selectedDayOfTheWeek.trim()?.toLowerCase())) ||
        (selectedDayOfTheWeek === "weekday" &&
          !(
            obs.__pubOnDOW?.trim()?.toLowerCase().includes("monday") ||
            obs.__pubOnDOW?.trim()?.toLowerCase().includes("tuesday") ||
            obs.__pubOnDOW?.trim()?.toLowerCase().includes("wednesday") ||
            obs.__pubOnDOW?.trim()?.toLowerCase().includes("thursday") ||
            obs.__pubOnDOW?.trim()?.toLowerCase().includes("friday")
          )) ||
        (selectedDayOfTheWeek === "weekend" &&
          !(
            obs.__pubOnDOW?.trim()?.toLowerCase().includes("saturday") ||
            obs.__pubOnDOW?.trim()?.toLowerCase().includes("sunday")
          ))
      )
    ) {
      filteredData.push(obs);
    }
  }

  setObsMatched(filteredData.length); //Update before we apply the filterStartAt & filterLimit

  //Take filterStartAt & filterLimit into account
  let filterStartAtFinal = filterStartAt;
  let filterLimitFinal = filterLimit;

  //Boundary fix for start
  if (filterStartAt <= 0 || filterStartAt === "") {
    filterStartAtFinal = 1;
  }

  //Boundary fix for limit
  if (filterLimit > filteredData.length || filterLimit === "") {
    filterLimitFinal = filteredData.length;
  }

  filteredData = filteredData.slice(
    filterStartAtFinal - 1,
    filterStartAtFinal - 1 + filterLimitFinal
  );

  //For performance reasons only sort the filtered data here, rather than sort all of the data available earlier
  const sortedData = structuredClone(filteredData);

  // Sorting the array by the filterSortByTextType key of the object
  sortedData.sort((a, b) => {
    const sortByA = a[filterSortByTextType];
    const sortByB = b[filterSortByTextType];

    // Handle different data types
    if (typeof sortByA === "string" && typeof sortByB === "string") {
      return filterSortByDescOrAsc === "D"
        ? sortByB.localeCompare(sortByA)
        : sortByA.localeCompare(sortByB);
    } else if (typeof sortByA === "number" && typeof sortByB === "number") {
      return filterSortByDescOrAsc === "D"
        ? sortByB - sortByA
        : sortByA - sortByB;
    } else if (typeof sortByA === "boolean" && typeof sortByB === "boolean") {
      return filterSortByDescOrAsc === "D"
        ? Number(sortByB) - Number(sortByA)
        : Number(sortByA) - Number(sortByB);
    } else {
      return 0; // Default case if types mismatch
    }
  });

  return sortedData;
};
