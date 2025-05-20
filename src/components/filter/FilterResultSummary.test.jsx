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

  const renderComponent = (props = {}) => {
    return render(
      <FilterResultSummary
        obsMatched={obsMatched}
        obsTotal={obsTotal}
        filterLimitForResultSummary={filterLimitForResultSummary}
        obsShowingHowMany={obsShowingHowMany}
        onResultStartAtClick={onResultStartAtClick}
        onResultLimitClick={onResultLimitClick}
        {...props}
      />
    );
  };

  it("should not render anything if obsTotal is 0", () => {
    const { container } = renderComponent({ obsTotal: 0 });
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toBeNull();
  });

  it("should render the summary when obsTotal is greater than 0", () => {
    renderComponent();
    expect(screen.getByText(`${obsMatched}`)).toBeInTheDocument();
    expect(screen.getByText(`${obsTotal}`)).toBeInTheDocument();
  });

  it('should render the "more than" message when obsMatched is greater than filterLimitForResultSummary', () => {
    renderComponent();
    expect(screen.getByText(/Taking into account the/i)).toBeInTheDocument();
    expect(screen.getByText(/only showing/i)).toBeInTheDocument();
    expect(screen.getByText(`${obsShowingHowMany}`)).toBeInTheDocument();
  });

  it('should call onResultStartAtClick when the "Results Start From" button is clicked', () => {
    renderComponent();
    const startAtButton = screen.getByText(/Results Start From/i);
    fireEvent.click(startAtButton);
    expect(onResultStartAtClick).toHaveBeenCalledTimes(1);
  });

  it('should call onResultLimitClick when the "Result Limit" button is clicked', () => {
    renderComponent();
    const limitButton = screen.getByText(/Result Limit/i);
    fireEvent.click(limitButton);
    expect(onResultLimitClick).toHaveBeenCalledTimes(1);
  });

  it('should not render the "more than" message when obsMatched is not greater than filterLimitForResultSummary', () => {
    renderComponent({ obsMatched: 20 });
    const moreThanMessage = screen.queryByText(/Taking into account the/i);
    expect(moreThanMessage).toBeNull();
  });
});
