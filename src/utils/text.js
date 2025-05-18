export const trimText = (
  text = "",
  maxLength = text.length,
  elipsisText = "..."
) => (text.length > maxLength ? text.slice(0, maxLength) + elipsisText : text);

export const splitWordsAndNumbers = (str) => {
  const matches = str.match(/([a-zA-Z]+)|(\d+)/g); // Regex to capture words and numbers separately
  return matches || []; // Return matches or empty array if no match found
};
