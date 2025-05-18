import { getCurrentTimeFormatted } from "./date-and-time";

/* eslint-disable no-restricted-globals */

self.onmessage = (event) => {
  const { url } = event.data;

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();

      self.postMessage({ status: "updated", data });

      console.log(`Worker ${getCurrentTimeFormatted()}`, data);

      // Handle stopping the interval based on response
      if (data.status === "ready") {
        clearInterval(intervalId);
        self.postMessage({ status: "completed", data });
        console.log("Worker interval checks stopped!");
        return;
      }
    } catch (error) {
      self.postMessage({ status: "error", message: error.message });
    }
  };

  // Check data every 5 seconds
  const intervalId = setInterval(fetchData, 5000);
};
