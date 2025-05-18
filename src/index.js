// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // Commented Strict Mode due to the purpose of this app mostly being used in dev mode and highly relying on fetching of data, which StrictMode as you know interferes with
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
