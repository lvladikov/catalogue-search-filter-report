import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterResultSummary from "./FilterResultSummary";

describe("FilterResultSummary Component", () => {
  const obsMatched = 100;
  const obsTotal = 200;
  const filterLimitForResultSummary = 50;
  const obsShowingHowMany = 50;
  const onResultStartAtClick = jest.fn();
  const onResultLimitClick = jest.fn();

  it("should not render anything if obsTotal is 0", () => {
    const { container } = render(
      <FilterResultSummary
        obsMatched={obsMatched}
        obsTotal={0}
        filterLimitForResultSummary={filterLimitForResultSummary}
        obsShowingHowMany={obsShowingHowMany}
        onResultStartAtClick={onResultStartAtClick}
        onResultLimitClick={onResultLimitClick}
      />
    );
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toBeNull();
  });

  it("should render the summary when obsTotal is greater than 0", () => {
    render(
      <FilterResultSummary
        obsMatched={obsMatched}
        obsTotal={obsTotal}
        filterLimitForResultSummary={filterLimitForResultSummary}
        obsShowingHowMany={obsShowingHowMany}
        onResultStartAtClick={onResultStartAtClick}
        onResultLimitClick={onResultLimitClick}
      />
    );
    expect(screen.getByText(`${obsMatched}`)).toBeInTheDocument();
    expect(screen.getByText(`${obsTotal}`)).toBeInTheDocument();
  });

  it('should render the "more than" message when obsMatched is greater than filterLimitForResultSummary', () => {
    render(
      <FilterResultSummary
        obsMatched={obsMatched}
        obsTotal={obsTotal}
        filterLimitForResultSummary={filterLimitForResultSummary}
        obsShowingHowMany={obsShowingHowMany}
        onResultStartAtClick={onResultStartAtClick}
        onResultLimitClick={onResultLimitClick}
      />
    );
    expect(screen.getByText(/Taking into account the/i)).toBeInTheDocument();
    expect(screen.getByText(/only showing/i)).toBeInTheDocument();
    expect(screen.getByText(`${obsShowingHowMany}`)).toBeInTheDocument();
  });

  it('should call onResultStartAtClick when the "Results Start From" button is clicked', () => {
    render(
      <FilterResultSummary
        obsMatched={obsMatched}
        obsTotal={obsTotal}
        filterLimitForResultSummary={filterLimitForResultSummary}
        obsShowingHowMany={obsShowingHowMany}
        onResultStartAtClick={onResultStartAtClick}
        onResultLimitClick={onResultLimitClick}
      />
    );
    const startAtButton = screen.getByText(/Results Start From/i);
    fireEvent.click(startAtButton);
    expect(onResultStartAtClick).toHaveBeenCalledTimes(1);
  });

  it('should call onResultLimitClick when the "Result Limit" button is clicked', () => {
    render(
      <FilterResultSummary
        obsMatched={obsMatched}
        obsTotal={obsTotal}
        filterLimitForResultSummary={filterLimitForResultSummary}
        obsShowingHowMany={obsShowingHowMany}
        onResultStartAtClick={onResultStartAtClick}
        onResultLimitClick={onResultLimitClick}
      />
    );
    const limitButton = screen.getByText(/Result Limit/i);
    fireEvent.click(limitButton);
    expect(onResultLimitClick).toHaveBeenCalledTimes(1);
  });

  it('should not render the "more than" message when obsMatched is not greater than filterLimitForResultSummary', () => {
    render(
      <FilterResultSummary
        obsMatched={20}
        obsTotal={obsTotal}
        filterLimitForResultSummary={filterLimitForResultSummary}
        obsShowingHowMany={obsShowingHowMany}
        onResultStartAtClick={onResultStartAtClick}
        onResultLimitClick={onResultLimitClick}
      />
    );
    const moreThanMessage = screen.queryByText(/Taking into account the/i);
    expect(moreThanMessage).toBeNull();
  });
});
