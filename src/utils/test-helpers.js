export const mockFetch = (data) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(data),
      status: 200,
    })
  );
};

export const mockGetTime = (mockedTime) => {
  jest.spyOn(Date.prototype, "getTime").mockImplementation(() => mockedTime);
};

export const mockConsoleError = (mockedError = () => {}) => {
  jest.spyOn(console, "error").mockImplementation(mockedError);
};

export const mockConsoleLog = (mockedLog = () => {}) => {
  jest.spyOn(console, "log").mockImplementation(mockedLog);
};
