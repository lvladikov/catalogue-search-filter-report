import { useState, useRef, useEffect } from "react";

import CommonButton from "../common/CommonButton";
import PDFWorker from "./PDFWorker";

import {
  getCurrentTimeFormatted,
  formatTimeFromSeconds,
} from "../../utils/date-and-time";

const localPDFGenTriggerURL =
  "http://localhost:3050/generate-pdf-report-trigger";

const localPDFGenResetURL = "http://localhost:3050/generate-pdf-reset";

const localPDFOutputURL = "http://localhost:3050/report/";

export default function PDFGenerateContainer({ file }) {
  const [workerData, setWorkerData] = useState({});
  const [workerStatus, setWorkerStatus] = useState("idle");
  const [pdfButtonDisabled, setPDFButtonDisabled] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const pdfJobID = useRef(btoa(getCurrentTimeFormatted()));

  const activeWorker =
    //As long as it's either the "trigger" from handlePDFReport,
    //or the then ongoing "updated" continue
    //if the initial "idle" or the end "completed", unmount PDFWorker
    workerStatus === "trigger" || workerStatus === "updated";

  const handlePDFReadyConfirm = async () => {
    //Send pdf reset request to the server, so it goes back to awaiting
    await fetch(`${localPDFGenResetURL}?id=${pdfJobID.current}`);

    //Also generate new job ID for the next time we'll need PDF gen job, otherwise the ref would keep the same value as before
    if (pdfJobID.current) {
      pdfJobID.current = btoa(getCurrentTimeFormatted());
    }
    //Also reset workerStatus back to idle
    setWorkerStatus("idle");

    //And enable back the PDF Generate Button
    setPDFButtonDisabled(false);

    //Reset timer
    setStartTime(null);
    setElapsedTime(0);
  };

  const handlePDFReport = () => {
    if (!file) return;

    setWorkerStatus("trigger");
    setPDFButtonDisabled(true);

    //Start tracking time
    setStartTime(Date.now());

    //Prepare the uploaded file contents as FormData
    const formData = new FormData();
    formData.append("file", file);

    //Append the id to the FormData
    formData.append("id", pdfJobID.current);

    //no need to await this as it's a trigger and the web worker
    //would be checking the status via own API endpoint
    fetch(localPDFGenTriggerURL, {
      method: "POST",
      body: formData,
    });
  };

  useEffect(() => {
    let interval;
    if (startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    if (workerStatus === "completed") {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [startTime, workerStatus]);

  return (
    <>
      {activeWorker && (
        <PDFWorker
          pdfJobID={pdfJobID}
          onWorkerDataUpdate={setWorkerData}
          onWorkerStatusUpdate={setWorkerStatus}
        />
      )}
      <div className="generate-pdf-report-wrapper">
        <CommonButton
          id="pdfReport"
          title="Generate PDF Report with ALL the Unfiltered data (will use Web Worker and Local Server utilizing Puppeteer and may take a while)"
          type="button"
          value="Generate PDF"
          className="generate-pdf-report-btn"
          disabled={pdfButtonDisabled}
          onClick={handlePDFReport}
        />
        <div className="generate-pdf-report-status">
          {activeWorker && `Generating PDF in progress ...`}
          {startTime && workerStatus !== "completed" && (
            <p>Time elapsed: {formatTimeFromSeconds(elapsedTime)}</p>
          )}
          {workerStatus === "completed" && (
            <>
              <span>
                Generating your PDF is now complete (it took{" "}
                {formatTimeFromSeconds(elapsedTime)})! Please{" "}
                <a
                  href={localPDFOutputURL + workerData?.pdfFileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-like-button"
                  title={`PDF file ${workerData?.pdfFileName} ready to open!`}
                >
                  click here
                </a>{" "}
                to open the {workerData?.pdfFileName}!
              </span>{" "}
              <button
                onClick={handlePDFReadyConfirm}
                className="text-like-button"
                title="Click to confirm you've read the message about your PDF being ready!"
              >
                Confirm Read!
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
