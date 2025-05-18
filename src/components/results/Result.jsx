import { getDayOfWeekFromDate } from "../../utils/date-and-time";
import { trimText } from "../../utils/text";

const LOCAL_SERVER_CACHED_IMAGES_URL = "http://localhost:3050/images/";

export default function Result({
  currentIdx,
  title,
  imagePath,
  detailsID,
  pubOn,
  observedOn,
  objType,
  coords,
  expTime,
  expTimeInSeconds,
  filters,
  tScope,
  imgFramesLength,
  cost,
  grabbed,
  note,
  summary,
  listFilesFolders,
}) {
  let listFilesFoldersHTML = "";
  if (listFilesFolders !== "") {
    listFilesFoldersHTML = (
      <>
        <span>Observation Files and Folders</span>
        <span className="dotted-space"></span>
        <pre className="files-folders-text">{listFilesFolders}</pre>
      </>
    );
  }

  const cachedImage = imagePath.includes(LOCAL_SERVER_CACHED_IMAGES_URL);

  return (
    <div className="observation-display-container">
      <div className="observation-display-container--data-row">
        <div className="observation-display-container--data--obs-details">
          <div className="obs-view obs-view-bordered">
            <div className="obs-view__header">
              <h5
                className="obs-view-title my-obs-title-elm-filter-action--link"
                title={`Load the observation for ${title}`}
              >
                <em>[{currentIdx}]</em>{" "}
                <span className="title-container">{title}</span>
              </h5>
            </div>
            <div
              className={`obs-view__image ${
                cachedImage ? "image-cached" : "image-not-cached"
              }`}
              title={
                cachedImage
                  ? "Image is locally cached"
                  : "Image is not cached locally"
              }
            >
              <div className="aspect-ratio-img">
                <img alt={title} src={imagePath} />
              </div>
            </div>
            <div className="obs-view__info">
              <ul className="obs-view-list">
                <li className="list-item">
                  <span>Pub On</span>
                  <span className="dotted-space"></span>
                  <span data-full-dow={pubOn}>
                    {pubOn}, {getDayOfWeekFromDate(new Date(pubOn))}
                  </span>
                </li>
                <li className="list-item list-item--observed-on">
                  <span>Obs On</span>
                  <span className="dotted-space"></span>
                  <span title={observedOn} className="observed-on-text">
                    <em>{trimText(observedOn, 300)}</em>
                  </span>
                </li>
                <li className="list-item">
                  <span>Object Type</span>
                  <span className="dotted-space"></span>
                  <span className="object-type-container">{objType}</span>
                </li>
                <li className="list-item">
                  <span>Coordinates</span>
                  <span className="dotted-space"></span>
                  <span>
                    <div>RA {coords.ra}</div>
                    <div>Dec {coords.dec}</div>
                  </span>
                </li>
                <li className="list-item">
                  <span>Tot Exp Time</span>
                  <span className="dotted-space"></span>
                  <span>{expTime}</span>
                </li>
                <li className="list-item">
                  <span>Tot Exp (secs)</span>
                  <span className="dotted-space"></span>
                  <span>{expTimeInSeconds}s</span>
                </li>
                <li className="list-item">
                  <span>Filters</span>
                  <span className="dotted-space"></span>
                  <span className="filters-container">{filters}</span>
                </li>
                <li className="list-item">
                  <span>Telescope</span>
                  <span className="dotted-space"></span>
                  <span className="telescope-container">{tScope}</span>
                </li>
                <li className="list-item">
                  <span className="number-of-images--action-toggle">
                    # Images
                  </span>
                  <span className="dotted-space"></span>
                  <span>{imgFramesLength}</span>
                </li>
                <li className="list-item">
                  <span>detailsID</span>
                  <span className="dotted-space"></span>
                  <span className="details-id-container">{detailsID}</span>
                </li>
                <li className="list-item">
                  <span>Cost</span>
                  <span className="dotted-space"></span>
                  <span className="cost-container">{cost}</span>
                </li>
                <li className="list-item">
                  <span>Grabbed (+FITS)</span>
                  <span className="dotted-space"></span>
                  <span>{grabbed ? "Yes" : "No"}</span>
                </li>
                <li className="list-item list-item--note">
                  <span>Note/Folder</span>
                  <span className="dotted-space"></span>
                  <span className="note-text" data-full-text={note}>
                    {trimText(note, 45)}
                  </span>
                </li>
                <li className="list-item list-item--summary">
                  <span>Summary</span>
                  <span className="dotted-space"></span>
                  <span className="summary-text" data-full-text={summary}>
                    {trimText(summary, 550)}
                  </span>
                </li>
                <li className="list-item list-item--files-folders">
                  {listFilesFoldersHTML}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
