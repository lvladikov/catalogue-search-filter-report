import { useEffect, useReducer, useRef } from "react";

import CommonSelect from "../common/CommonSelect";
import CommonInput from "../common/CommonInput";
import CommonButton from "../common/CommonButton";
import FilterResultSummary from "./FilterResultSummary";

import {
  months,
  years,
  daysOfTheWeek,
  telescopes,
  filterByTextTypeOptions,
  filterSortByTextTypeOptions,
} from "../../utils/options";

import {
  getCurrentMonthIndex,
  getCurrentYear,
} from "../../utils/date-and-time";
import { getFilteredData } from "../../utils/filter";

// Initial Constants for Filter State
const filterByTextTypeOptionInitial = filterByTextTypeOptions[0].value;
const filterByTextInitial = "";
const filterExactOrPartialInitial = "P"; // 'P' for Partial, 'E' for Exact

const monthInitial = months[0].value;
const yearInitial = years[0].value;
const dayOfTheWeekInitial = daysOfTheWeek[0].value;

const telescopeInitial = telescopes[0].value;

const filterSortByTextTypeInitial = filterSortByTextTypeOptions[0].value;
const filterSortByDescOrAscInitial = "D"; // 'D' for Descending, 'A' for Ascending

const filterStartAtInitial = 1;
const filterLimitInitial = 20;

const obsMatchedInitial = 0;
const obsTotalInitial = 0;
const obsShowingHowManyInitial = filterLimitInitial;

// Action Types for useReducer
const ACTIONS = {
  SET_FILTER_BY_TEXT_TYPE: "SET_FILTER_BY_TEXT_TYPE",
  SET_FILTER_BY_TEXT: "SET_FILTER_BY_TEXT",
  TOGGLE_FILTER_EXACT_OR_PARTIAL: "TOGGLE_FILTER_EXACT_OR_PARTIAL",
  SET_SELECTED_MONTH: "SET_SELECTED_MONTH",
  SET_SELECTED_YEAR: "SET_SELECTED_YEAR",
  SET_SELECTED_DAY_OF_THE_WEEK: "SET_SELECTED_DAY_OF_THE_WEEK",
  SET_SELECTED_TELESCOPE: "SET_SELECTED_TELESCOPE",
  TOGGLE_FILTER_SORT_BY_DESC_OR_ASC: "TOGGLE_FILTER_SORT_BY_DESC_OR_ASC",
  SET_FILTER_SORT_BY_TEXT_TYPE: "SET_FILTER_SORT_BY_TEXT_TYPE",
  SET_FILTER_START_AT: "SET_FILTER_START_AT",
  SET_FILTER_LIMIT: "SET_FILTER_LIMIT",
  SET_OBS_MATCHED: "SET_OBS_MATCHED",
  SET_OBS_TOTAL: "SET_OBS_TOTAL",
  SET_OBS_SHOWING_HOW_MANY: "SET_OBS_SHOWING_HOW_MANY",
  SET_FILTER_LIMIT_FOR_RESULT_SUMMARY: "SET_FILTER_LIMIT_FOR_RESULT_SUMMARY",
  RESET_FILTERS: "RESET_FILTERS",
  INITIALIZE_DATE_FILTERS: "INITIALIZE_DATE_FILTERS",
};

// Initial State Object
const initialState = {
  filterByTextType: filterByTextTypeOptionInitial,
  filterByText: filterByTextInitial,
  filterExactOrPartial: filterExactOrPartialInitial,
  selectedMonth: monthInitial,
  selectedYear: yearInitial,
  selectedDayOfTheWeek: dayOfTheWeekInitial,
  selectedTelescope: telescopeInitial,
  filterSortByDescOrAsc: filterSortByDescOrAscInitial,
  filterSortByTextType: filterSortByTextTypeInitial,
  filterStartAt: filterStartAtInitial,
  filterLimit: filterLimitInitial,
  filterLimitForResultSummary: filterLimitInitial, // will only get updated after the filter form is submitted
  obsMatched: obsMatchedInitial,
  obsTotal: obsTotalInitial,
  obsShowingHowMany: obsShowingHowManyInitial,
};

function filterReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_FILTER_BY_TEXT_TYPE:
      return { ...state, filterByTextType: action.payload };
    case ACTIONS.SET_FILTER_BY_TEXT:
      return { ...state, filterByText: action.payload };
    case ACTIONS.TOGGLE_FILTER_EXACT_OR_PARTIAL:
      return {
        ...state,
        filterExactOrPartial:
          state.filterExactOrPartial === filterExactOrPartialInitial
            ? "E"
            : filterExactOrPartialInitial,
      };
    case ACTIONS.SET_SELECTED_MONTH:
      return { ...state, selectedMonth: action.payload };
    case ACTIONS.SET_SELECTED_YEAR:
      return { ...state, selectedYear: action.payload };
    case ACTIONS.SET_SELECTED_DAY_OF_THE_WEEK:
      return { ...state, selectedDayOfTheWeek: action.payload };
    case ACTIONS.SET_SELECTED_TELESCOPE:
      return { ...state, selectedTelescope: action.payload };
    case ACTIONS.TOGGLE_FILTER_SORT_BY_DESC_OR_ASC:
      return {
        ...state,
        filterSortByDescOrAsc:
          state.filterSortByDescOrAsc === filterSortByDescOrAscInitial
            ? "A"
            : filterSortByDescOrAscInitial,
      };
    case ACTIONS.SET_FILTER_SORT_BY_TEXT_TYPE:
      return { ...state, filterSortByTextType: action.payload };
    case ACTIONS.SET_FILTER_START_AT:
      return { ...state, filterStartAt: action.payload };
    case ACTIONS.SET_FILTER_LIMIT:
      return { ...state, filterLimit: action.payload };
    case ACTIONS.SET_OBS_MATCHED:
      return { ...state, obsMatched: action.payload };
    case ACTIONS.SET_OBS_TOTAL:
      return { ...state, obsTotal: action.payload };
    case ACTIONS.SET_OBS_SHOWING_HOW_MANY:
      return { ...state, obsShowingHowMany: action.payload };
    case ACTIONS.SET_FILTER_LIMIT_FOR_RESULT_SUMMARY:
      return { ...state, filterLimitForResultSummary: action.payload };
    case ACTIONS.RESET_FILTERS:
      // Reset all filter states to their initial values.
      return initialState;
    case ACTIONS.INITIALIZE_DATE_FILTERS:
      // Action to initialize month and year from useEffect.
      return {
        ...state,
        selectedMonth: action.payload.month,
        selectedYear: action.payload.year,
      };
    default:
      // If an unknown action is dispatched, return the current state unchanged.
      return state;
  }
}

export default function Filter({
  data,
  onUpdateFilters,
  serverIsLive,
  loading,
  onShowLoading,
}) {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  // Destructure state properties for easier access in JSX and handlers.
  const {
    filterByTextType,
    filterByText,
    filterExactOrPartial,
    selectedMonth,
    selectedYear,
    selectedDayOfTheWeek,
    selectedTelescope,
    filterSortByDescOrAsc,
    filterSortByTextType,
    filterStartAt,
    filterLimit,
    filterLimitForResultSummary,
    obsMatched,
    obsTotal,
    obsShowingHowMany,
  } = state;

  // These two refs will be used for focus on the respective inputs,
  // triggered from outside their containing form.
  const obsDisplayFilterLimitRef = useRef(null);
  const obsDisplayFilterStartAtRef = useRef(null);

  const handleFilterExactOrPartial = () => {
    dispatch({ type: ACTIONS.TOGGLE_FILTER_EXACT_OR_PARTIAL });
  };

  const handleFilterSortByDescOrAsc = () => {
    dispatch({ type: ACTIONS.TOGGLE_FILTER_SORT_BY_DESC_OR_ASC });
  };

  const handleFilterFormSubmit = (e) => {
    e.preventDefault();

    console.log(`handleFilterFormSubmit

      serverIsLive: ${serverIsLive}

      filterByText: ${filterByText}
      filterByTextType: ${filterByTextType}
      filterExactOrPartial: ${filterExactOrPartial}

      selectedTelescope: ${selectedTelescope}

      filterSortByTextType: ${filterSortByTextType}
      filterSortByDescOrAsc: ${filterSortByDescOrAsc}
      
      selectedYear: ${selectedYear}
      selectedMonth: ${selectedMonth}
      selectedDayOfTheWeek: ${selectedDayOfTheWeek}

      filterStartAt: ${filterStartAt}
      filterLimit: ${filterLimit}

      obsMatched: ${obsMatched}
      obsTotal: ${obsTotal}
      obsShowingHowMany: ${obsShowingHowMany}
    `);

    // If the server is down, which means no cached images warn that there is a risk of overloading
    // Live websites where the images are loaded from, if more than 100
    if (!serverIsLive && filterLimit > 100) {
      const confirmContinue = window.confirm(
        `Please note that the local image caching server is not running \
and as such all images would load straight from the live site(s), \
and you might start seeing errors!

Do you want to proceed? 
        
If not, press Cancel and lower the Filter Limit (or apply more specific filters), \
or start the caching server and reload the app!
`
      );

      if (!confirmContinue) {
        handleFocusOnFilterLimitElm(); //focus on the Filter Limit field
        return;
      }
    }
    onUpdateFilters(null); //Hide results while we prepare the new ones
    onShowLoading(true);

    //Use null timeout to allow the hiding of elements to complete first as all react update state are async
    //To then process the data and update the UI
    //The timeout doesn't do anything but queue up the code below after the code above has finished
    //This is an easier approach vs using an effect and tracking multiple flags (results and others) which could clash with the initial state of no results
    setTimeout(() => {
      //Process filters and return filtered data
      const filteredData = getFilteredData({
        rawData: data,
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
        setObsMatched: (value) =>
          dispatch({ type: ACTIONS.SET_OBS_MATCHED, payload: value }),
      });

      onUpdateFilters(filteredData);

      // Note that the `onShowLoading(false)` will be handled in Results.jsx after it's done the additional processing

      // Update result summary related states.
      dispatch({
        type: ACTIONS.SET_OBS_SHOWING_HOW_MANY,
        payload: filteredData.length,
      });
      dispatch({ type: ACTIONS.SET_OBS_TOTAL, payload: data?.length });

      // keeping this as separate state so that changes made to the filterLimit only
      // updates/rerenders FilterResultSummary after the form has been resubmitted and not on every keystroke
      dispatch({
        type: ACTIONS.SET_FILTER_LIMIT_FOR_RESULT_SUMMARY,
        payload: filterLimit,
      });
    }, 0);
  };

  const handleReset = () => {
    dispatch({ type: ACTIONS.RESET_FILTERS });
    onUpdateFilters(null);
  };

  const handleFilterLimitsCommonChange = (e, actionType) => {
    const targetValue = e.target.value;
    const targetValueInt = parseInt(targetValue);

    if (!Number.isNaN(targetValueInt) && targetValueInt >= 0) {
      dispatch({ type: actionType, payload: targetValueInt });
    } else if (targetValue === "") {
      // Allow temporary empty value, while the user is editing.
      dispatch({ type: actionType, payload: targetValue });
    } else {
      // Don't allow other values such as non positive numeric and non-empty string to update the state.
    }
  };

  const handleFilterStartAtChange = (e) => {
    handleFilterLimitsCommonChange(e, ACTIONS.SET_FILTER_START_AT);
  };

  const handleFilterLimitChange = (e) => {
    handleFilterLimitsCommonChange(e, ACTIONS.SET_FILTER_LIMIT);
  };

  const handleFocusOnFilterStartAtElm = () => {
    if (obsDisplayFilterStartAtRef.current) {
      obsDisplayFilterStartAtRef.current.focus();
    }
  };

  const handleFocusOnFilterLimitElm = () => {
    if (obsDisplayFilterLimitRef.current) {
      obsDisplayFilterLimitRef.current.focus();
    }
  };

  useEffect(() => {
    // Preselect month and year
    const currentMonthIndex = getCurrentMonthIndex();
    const currentYear = getCurrentYear();
    // Set default month +1 because of the "ANY" entry at 0
    const monthValue = months[currentMonthIndex + 1].value;
    const yearValue =
      years.find((y) => y.value === String(currentYear))?.value ||
      years[0].value;

    dispatch({
      type: ACTIONS.INITIALIZE_DATE_FILTERS,
      payload: { month: monthValue, year: yearValue },
    });
  }, []); // Empty dependency array ensures this runs only once on mount.

  return (
    <div>
      <div className="observation-display-filters-wrapper">
        <form id="filterForm" onSubmit={handleFilterFormSubmit}>
          <CommonInput
            id="obsDisplayFilterByTextMatch"
            title="Search either for single text or multiple text matches using the || separator. For empty value match '' use the word 'empty' (makes most sense to be used with Notes/Folder)! Also use the word 'mismatch' to catch potential problems (such as title words not matching note/folder/summary)."
            value={filterByText}
            onChange={(e) =>
              dispatch({
                type: ACTIONS.SET_FILTER_BY_TEXT,
                payload: e.target.value,
              })
            }
          >
            Filter by text:
          </CommonInput>
          <CommonSelect
            options={filterByTextTypeOptions}
            id="obsDisplayFilterByTextFor"
            value={filterByTextType}
            onChange={(e) =>
              dispatch({
                type: ACTIONS.SET_FILTER_BY_TEXT_TYPE,
                payload: e.target.value,
              })
            }
          >
            (
            <span
              className="filter-exact-partial-choose"
              title={`Filter by ${
                filterExactOrPartial === filterExactOrPartialInitial
                  ? "Partial"
                  : "Exact"
              } Match`}
              value={filterExactOrPartial}
              onClick={handleFilterExactOrPartial}
            >
              {filterExactOrPartial}
            </span>
            ) match for:
          </CommonSelect>
          <CommonSelect
            options={telescopes}
            id="obsDisplayFilterByScope"
            value={selectedTelescope}
            onChange={(e) =>
              dispatch({
                type: ACTIONS.SET_SELECTED_TELESCOPE,
                payload: e.target.value,
              })
            }
          >
            Filter by Scope:{" "}
          </CommonSelect>
          <div className="observation-display-filters-breaker"></div>
          <CommonSelect
            options={years}
            id="obsDisplayFilterByYear"
            value={selectedYear}
            onChange={(e) =>
              dispatch({
                type: ACTIONS.SET_SELECTED_YEAR,
                payload: e.target.value,
              })
            }
          >
            Filter by Year:{" "}
          </CommonSelect>
          <CommonSelect
            options={months}
            id="obsDisplayFilterByMonth"
            value={selectedMonth}
            onChange={(e) =>
              dispatch({
                type: ACTIONS.SET_SELECTED_MONTH,
                payload: e.target.value,
              })
            }
          >
            Filter by Month:{" "}
          </CommonSelect>
          <CommonSelect
            options={daysOfTheWeek}
            id="obsDisplayFilterByDOW"
            value={selectedDayOfTheWeek}
            onChange={(e) =>
              dispatch({
                type: ACTIONS.SET_SELECTED_DAY_OF_THE_WEEK,
                payload: e.target.value,
              })
            }
          >
            Filter by Day of the week:{" "}
          </CommonSelect>
          <CommonSelect
            options={filterSortByTextTypeOptions}
            id="obsDisplayFilterSortByTextType"
            value={filterSortByTextType}
            onChange={(e) =>
              dispatch({
                type: ACTIONS.SET_FILTER_SORT_BY_TEXT_TYPE,
                payload: e.target.value,
              })
            }
          >
            Sort by{" "}
            <span
              className="filter-sort-by"
              title={`Sort By in ${
                filterSortByDescOrAsc === filterSortByDescOrAscInitial
                  ? "Descending order Z -> A"
                  : "Ascending order A -> Z"
              }`}
              value={filterSortByDescOrAsc}
              onClick={handleFilterSortByDescOrAsc}
            >
              ({filterSortByDescOrAsc})
            </span>
          </CommonSelect>

          <CommonInput
            ref={obsDisplayFilterStartAtRef}
            id="obsDisplayFilterStartAt"
            title="Results limit - start from certain result number, i.e. skip previous X number of results; If 0 or 1 is used, it starts from the first match."
            value={filterStartAt}
            onChange={handleFilterStartAtChange}
          >
            Results start from:
          </CommonInput>

          <CommonInput
            ref={obsDisplayFilterLimitRef}
            id="obsDisplayFilterLimit"
            title="Results limit, type a very large number if you don't want any"
            value={filterLimit}
            onChange={handleFilterLimitChange}
          >
            Results limit:
          </CommonInput>

          <div className="observation-display-filters-breaker"></div>
          <CommonButton
            id="obsDisplayFiltersProcessBtn"
            title="Process Data based on Filters applied"
            type="submit"
            value="Go"
            className="observation-display-filters-process-btn"
          />

          <CommonButton
            id="obsDisplayFiltersResetBtn"
            title="Reset all filtering options (no preselected dates)"
            type="button"
            value="Reset"
            className="observation-display-filters-reset-btn"
            onClick={handleReset}
          />
        </form>

        {!loading && (
          <FilterResultSummary
            obsMatched={obsMatched}
            obsTotal={obsTotal}
            filterLimitForResultSummary={filterLimitForResultSummary}
            obsShowingHowMany={obsShowingHowMany}
            onResultStartAtClick={handleFocusOnFilterStartAtElm}
            onResultLimitClick={handleFocusOnFilterLimitElm}
          />
        )}
      </div>
    </div>
  );
}
