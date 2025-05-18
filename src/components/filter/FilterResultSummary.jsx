export default function FilterResultSummary({
  obsMatched,
  obsTotal,
  filterLimitForResultSummary,
  obsShowingHowMany,
  onResultStartAtClick,
  onResultLimitClick,
}) {
  if (obsTotal === 0) return;

  return (
    <div className="observation-display-filters-result">
      <span className="obs-matched">{obsMatched}</span> observations matched
      (out of <span className="obs-total">{obsTotal}</span>
      ).{" "}
      {obsMatched > filterLimitForResultSummary && (
        <>
          <p className="obs-matched-more-than">
            Taking into account the{" "}
            <button
              onClick={onResultStartAtClick}
              className="text-like-button"
              title="Click to focus on the Results Start From input"
            >
              Results Start From
            </button>{" "}
            and{" "}
            <button
              onClick={onResultLimitClick}
              className="text-like-button"
              title="Click to focus on the Results Limit input"
            >
              Result Limit
            </button>{" "}
            values, only showing{" "}
            <span
              className="obs-matched-more-than-how-many"
              value={obsShowingHowMany}
            >
              {obsShowingHowMany}
            </span>{" "}
            out of the matched {obsMatched}.
          </p>
        </>
      )}
    </div>
  );
}
