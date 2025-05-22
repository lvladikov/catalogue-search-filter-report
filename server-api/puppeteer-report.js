const fs = require("fs").promises;
const path = require("path");

const puppeteer = require("puppeteer");

const {
  getDayOfWeekFromDate,
  getMonthFromDate,
  getYearFromDate,
  smartTime,
  trimText,
  getFormattedTimestamp,
  deleteFileIfExists,
} = require("./helpers");

const { loadCache, PI_IMAGE_BASE_PATH } = require("./cache-images");

const REPORT_OUT_FOLDER = path.resolve(__dirname, "../report");

const MISSING_IMAGE_LOCAL = "missing_image.jpg";

const htmlTemplateFile = "report-base-template.html";

const LOCAL_SERVER_CACHED_IMAGES_URL = "http://localhost:3050/images/";
const LOCAL_SERVER_REPORT_OUTPUT_URL = "http://localhost:3050/report/";
const LOCAL_SERVER_CSS_URL = "http://localhost:3050/assets/report.css";

const sortBy = "title"; // "title" | "note" | ..., title works best for the PDF Report

const pupReport = async ({ file }) => {
  const htmlOutFName = `${getFormattedTimestamp()}-report.html`;
  const htmlOutputFile = path.join(REPORT_OUT_FOLDER, htmlOutFName);
  const pdfOutFName = `${getFormattedTimestamp()}-report.pdf`;
  const pdfOutputFile = path.join(REPORT_OUT_FOLDER, pdfOutFName);

  let cache = await loadCache();

  try {
    // Load the HTML template.
    let html = await fs.readFile(htmlTemplateFile, "utf8");
    html = html.replace(
      "<!-- css-placeholder -->",
      `<link
      rel="stylesheet"
      href="${LOCAL_SERVER_CSS_URL}"
      media="all"
    />
    `
    );

    const data = file.buffer.toString();

    const jsonData = JSON.parse(data);

    // Transform the JSON data to array of objects
    const resultArray = Object.entries(jsonData?.observationsMeta).map(
      ([key, value]) => ({ imagePath: key, ...value })
    );

    // Sorting the array by the sortBy key of the object, for example title
    resultArray.sort((a, b) => {
      const sortByA = a[sortBy];
      const sortByB = b[sortBy];

      return sortByA.localeCompare(sortByB);
    });

    let htmlReport = "";
    let currentIdx = 0;

    for (let obs of resultArray) {
      currentIdx++;

      //Fallbacks for missing data fields
      obs.coords = obs.hasOwnProperty("coords")
        ? obs.coords
        : { dec: "", ra: "" };
      obs.cost = obs.hasOwnProperty("cost") ? obs.cost : 0;
      obs.detailsID = obs.hasOwnProperty("detailsID") ? obs.detailsID : "";
      obs.expTime = obs.hasOwnProperty("expTime") ? obs.expTime : "0min";
      obs.filters = obs.hasOwnProperty("filters") ? obs.filters : "";
      obs.grabbed = obs.hasOwnProperty("grabbed") ? obs.grabbed : false;
      obs.imagePath = obs.hasOwnProperty("imagePath") ? obs.imagePath : "";
      obs.imgFrames = obs.hasOwnProperty("imgFrames") ? obs.imgFrames : [];
      obs.note = obs.hasOwnProperty("note") ? obs.note : "";
      obs.objType = obs.hasOwnProperty("objType") ? obs.objType : "";
      obs.processed = obs.hasOwnProperty("processed") ? obs.processed : false;
      obs.pubOn = obs.hasOwnProperty("pubOn") ? obs.pubOn : "Jan 1 1970";
      obs.summary = obs.hasOwnProperty("summary") ? obs.summary : "";
      obs.tScope = obs.hasOwnProperty("tScope") ? obs.tScope : "";
      obs.title = obs.hasOwnProperty("title") ? obs.title : "";

      //Add Additional fields
      obs.__pubOnYear = getYearFromDate(new Date(obs.pubOn));
      obs.__pubOnMonth = getMonthFromDate(new Date(obs.pubOn));
      obs.__pubOnDOW = getDayOfWeekFromDate(new Date(obs.pubOn));
      obs.__observedOn = [...obs.imgFrames]
        .sort(({ datetime: a }, { datetime: b }) => new Date(a) - new Date(b))
        ?.reduce((acc, obsv) => acc + (acc ? ", " : "") + obsv.datetime, "");
      obs.__expTimeInSeconds = smartTime(obs.expTime);
      obs.__imgFramesLength = obs.imgFrames.length;

      //Overwrite imagePath with cached
      let imageURL = `${PI_IMAGE_BASE_PATH}${obs.imagePath}`;

      const existingEntry = cache.find(
        (entry) => entry.imageURL === imageURL
      ) || {
        imageURL,
        imageLocal: MISSING_IMAGE_LOCAL,
      };

      obs.imagePath = `${LOCAL_SERVER_CACHED_IMAGES_URL}${existingEntry?.imageLocal}`;

      htmlReport += `
        <div class="observation-display-container">
            <div class="observation-display-container--data-row">
              <div class="observation-display-container--data--obs-details">
                <div class="obs-view obs-view-bordered">
                  <div class="obs-view__header">
                    <h5
                      class="obs-view-title my-obs-title-elm-filter-action--link"
                    >
                      <em>[${currentIdx}]</em> 
                      <span class="title-container">${obs.title}</span>
                    </h5>
                  </div>
                  <div class="obs-view__image">
                    <div class="aspect-ratio-img">
                      <img src=${obs.imagePath} />
                    </div>
                  </div>
                  <div class="obs-view__info">
                    <ul class="obs-view-list">
                      <li class="list-item">
                        <span>Pub On</span>
                        <span class="dotted-space"></span>
                        <span>
                          ${obs.pubOn}, ${getDayOfWeekFromDate(
        new Date(obs.pubOn)
      )}
                        </span>
                      </li>
                      <li class="list-item list-item--observed-on">
                        <span>Obs On</span>
                        <span class="dotted-space"></span>
                        <span class="observed-on-text">
                          <em>${trimText(obs.__observedOn, 300)}</em>
                        </span>
                      </li>
                      <li class="list-item">
                        <span>Object Type</span>
                        <span class="dotted-space"></span>
                        <span class="object-type-container">${
                          obs.objType
                        }</span>
                      </li>
                      <li class="list-item">
                        <span>Coordinates</span>
                        <span class="dotted-space"></span>
                        <span>
                          <div>RA ${obs.coords.ra}</div>
                          <div>Dec ${obs.coords.dec}</div>
                        </span>
                      </li>
                      <li class="list-item">
                        <span>Tot Exp Time</span>
                        <span class="dotted-space"></span>
                        <span>${obs.expTime}</span>
                      </li>
                      <li class="list-item">
                        <span>Tot Exp (secs)</span>
                        <span class="dotted-space"></span>
                        <span>${obs.__expTimeInSeconds}s</span>
                      </li>
                      <li class="list-item">
                        <span>Filters</span>
                        <span class="dotted-space"></span>
                        <span class="filters-container">${obs.filters}</span>
                      </li>
                      <li class="list-item">
                        <span>Telescope</span>
                        <span class="dotted-space"></span>
                        <span class="telescope-container">${obs.tScope}</span>
                      </li>
                      <li class="list-item">
                        <span class="number-of-images--action-toggle">
                          # Images
                        </span>
                        <span class="dotted-space"></span>
                        <span>${obs.__imgFramesLength}</span>
                      </li>
                      <li class="list-item">
                        <span>detailsID</span>
                        <span class="dotted-space"></span>
                        <span class="details-id-container">${
                          obs.detailsID
                        }</span>
                      </li>
                      <li class="list-item">
                        <span>Cost</span>
                        <span class="dotted-space"></span>
                        <span class="cost-container">${obs.cost}</span>
                      </li>
                      <li class="list-item">
                        <span>Grabbed (+FITS)</span>
                        <span class="dotted-space"></span>
                        <span>${obs.grabbed ? "Yes" : "No"}</span>
                      </li>
                      <li class="list-item list-item--note">
                        <span>Note/Folder</span>
                        <span class="dotted-space"></span>
                        <span class="note-text">
                          ${trimText(obs.note, 45)}
                        </span>
                      </li>
                      <li class="list-item list-item--summary">
                        <span>Summary</span>
                        <span class="dotted-space"></span>
                        <span class="summary-text">
                          ${trimText(obs.summary, 800)}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
      `;
    }

    html = html.replace("<!-- data-placeholder -->", htmlReport);

    await fs.writeFile(htmlOutputFile, html, "utf8");

    //Start Preparing for the PDF

    const browser = await puppeteer.launch({
      //   headless: false, // <-- Put it here
      //   // You can add other options here too, like:
      //   slowMo: 50, // Slows down Puppeteer operations by 50ms for visual debugging
      //   devtools: true, // Opens the DevTools panel in the browser window
      protocolTimeout: 3600000, // Example: Increase to 60 minutes
      //   args: [
      //     "--disable-web-security",
      //     "--allow-file-access-from-files",
      //     "--no-sandbox",
      //     "--disable-setuid-sandbox",
      //   ],
    });
    const page = await browser.newPage();
    page.setDefaultTimeout(9000000); // Increase default to 9000 seconds

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      console.log(
        "Request:",
        request.method(),
        request.url(),
        request.resourceType()
      );
      request.continue();
    });

    await page.goto(`${LOCAL_SERVER_REPORT_OUTPUT_URL}${htmlOutFName}`, {
      waitUntil: "networkidle0",
    });

    // Generate and save the PDF.
    await page.pdf({
      path: pdfOutputFile,
      format: "A4",
      printBackground: true,
      timeout: 60000000, // Allow up to 6000 seconds for PDF generation
    });

    await browser.close();
    console.log(`PDF file successfully created: ${pdfOutputFile}`);

    //Once the PDF is complete, delete the temporary HTML that was needed to convert the PDF from
    await deleteFileIfExists(htmlOutputFile);

    return {
      pdfFileName: pdfOutFName,
      resultArray,
    };
  } catch (err) {
    console.error("Error reading file:", err);
  }
};

exports.pupReport = pupReport;
