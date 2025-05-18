import { trimText, splitWordsAndNumbers } from "./text";

describe("trimText", () => {
  it("should trim text that exceeds maxLength and add ellipsis", () => {
    expect(trimText("This is a long text", 10)).toBe("This is a ...");
  });

  it("should not trim text that is shorter than maxLength", () => {
    expect(trimText("Short text", 20)).toBe("Short text");
  });

  it("should use a default maxLength equal to the text length if maxLength is not provided", () => {
    expect(trimText("Default length")).toBe("Default length");
  });

  it("should use a custom ellipsis if elipsisText is provided", () => {
    expect(trimText("This is a long text", 10, "---")).toBe("This is a ---");
  });

  it("should handle empty string input", () => {
    expect(trimText("", 10)).toBe("");
  });
});

describe("splitWordsAndNumbers", () => {
  it("should split a string into words and numbers", () => {
    expect(splitWordsAndNumbers("word123number456")).toEqual([
      "word",
      "123",
      "number",
      "456",
    ]);
  });

  it("should return an empty array if the string is empty", () => {
    expect(splitWordsAndNumbers("")).toEqual([]);
  });

  it("should handle strings with only words", () => {
    expect(splitWordsAndNumbers("onlywords")).toEqual(["onlywords"]);
  });

  it("should handle strings with only numbers", () => {
    expect(splitWordsAndNumbers("123456")).toEqual(["123456"]);
  });

  it("should handle strings with special characters", () => {
    expect(splitWordsAndNumbers("word-123")).toEqual(["word", "123"]);
  });

  it("should handle strings starting with a number", () => {
    expect(splitWordsAndNumbers("123word")).toEqual(["123", "word"]);
  });
});
