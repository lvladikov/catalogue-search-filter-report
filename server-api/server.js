const path = require("path");

const express = require("express");
const cors = require("cors");

const { listFilesAndFolders } = require("./generate-files-and-folders-list");
const { doesFolderExist } = require("./helpers");
const { cacheImages, IMAGE_CACHE_FOLDER } = require("./cache-images");
const { pupReport } = require("./puppeteer-report");

const app = express();
const PORT = 3050;

const pdfJobs = {
  jobID0: { pdfReadyStatus: null, pdfFileName: null }, //example initial job to demonstrate object schema
};

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const REPORT_OUT_FOLDER = path.resolve(__dirname, "../report");
const ASSETS_FOLDER = path.join(__dirname, "assets");

const basePathDemoFolders = path.resolve(__dirname, "../demo-folders");

app.use("/images", express.static(IMAGE_CACHE_FOLDER));
app.use("/assets", express.static(ASSETS_FOLDER));
app.use("/report", express.static(REPORT_OUT_FOLDER));

app.get("/generate-pdf-reset", async (req, res) => {
  const { id } = req.query; // Extract dynamic ID from the URL

  if (!id) return;

  delete pdfJobs[id]; //Remove from jobs object

  console.log(`PDF Reset: ${id}  |  ${atob(id)}`);

  res.json({
    status: "reset-ok",
    pdfReadyStatus: undefined,
    pdfFileName: undefined,
  });
});

app.get("/generate-pdf-check-status", async (req, res) => {
  const { id } = req.query; // Extract dynamic ID from the URL

  if (!id) return;

  console.log(`PDF Check: ${id}  |  ${atob(id)}`, pdfJobs[id]?.pdfReadyStatus);
  // console.dir(pdfJobs);

  res.json({
    status:
      pdfJobs[id]?.pdfReadyStatus === undefined
        ? "awaiting-pdf-request"
        : pdfJobs[id]?.pdfReadyStatus === true
        ? "ready"
        : "work-in-progress",
    pdfReadyStatus: pdfJobs[id]?.pdfReadyStatus,
    pdfFileName: pdfJobs[id]?.pdfFileName,
  });
});

app.get("/generate-pdf-report-trigger", async (req, res) => {
  try {
    const { id, fileName } = req.query; // Extract dynamic ID from the URL

    console.log(`Received PDF request: ${id}  |  ${atob(id)}  |  ${fileName}`);

    if (!id || !fileName) return;

    //Dynamic Job ID for each Client session, which would be used with the check and reset calls as well
    //Until a new job id is sent
    pdfJobs[id] = { pdfReadyStatus: false, pdfFileName: undefined };

    const { pdfFileName, resultArray } = await pupReport({ id, fileName });

    pdfJobs[id] = {
      pdfReadyStatus: true,
      pdfFileName: pdfFileName,
      pdfResult: resultArray.slice(0, 100),
    };

    console.log(`PDF Response given...`);

    res.json(pdfJobs[id]);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ status: "error", error: "Internal Server Error" });
  }
});

app.get("/check-server-live", async (req, res) => {
  const { id } = req.query; // Extract dynamic ID from the URL

  res.json({
    status: "ok",
    id, //loopback the id to confirm to client it matches what they sent
  });
});

app.get("/cache-images", async (req, res) => {
  try {
    const { fileName } = req.query; // Extract dynamic ID from the URL

    console.log(`Received Cache Images request: ${fileName}`);

    //Note that if you have a very large number of uncached images and try to cache them all at once
    //and they all come from the same remote server, you may hit ERR_INSUFFICIENT_RESOURCES issues
    //ideally you would need to build your cache gradually, in chunks not all at once
    const cacheResult = await cacheImages(fileName);

    res.json(cacheResult);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ status: "error", error: "Internal Server Error" });
  }
});

app.get("/generate-files-and-folders-list", async (req, res) => {
  try {
    const { id } = req.query; // Extract dynamic ID from the URL
    // console.log(
    //   `Received request for
    //     Path: ${id}
    // );

    let listFilesFolders = "";

    //If Note/Folder is not empty, check if the folder exists
    if (id && id !== "") {
      const existsInGrabbed = await doesFolderExist(basePathDemoFolders, id);

      if (existsInGrabbed) {
        listFilesFolders = await listFilesAndFolders(
          path.join(basePathDemoFolders, id)
        );
      }
    } else {
      // throw new Error("Missing note/folder");
      console.error("Missing note/folder");
    }

    const data = {
      path: id,
      status: "ok",
      listFilesFolders,
    };

    if (listFilesFolders === "") {
      delete data.listFilesFolders;
    }

    res.json(data);
  } catch (error) {
    console.error("Error processing request:", error);
    //   res.status(500).json({ status: "error", error: "Internal Server Error" });

    // Even for observations with missing notes or cache don't break the response,
    // they just will not benefit from these fields and features but the rest would still load
    res.json({ status: "ok" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
