import { useEffect, useState } from "react";

import Result from "./Result";

import { smartTime } from "../../utils/date-and-time";
import PDFGenerateContainer from "../pdf-generate/PDFGenerateContainer";

const PI_IMAGE_BASE_PATH = "https://i.postimg.cc/";
const LOCAL_SERVER_GET_FILES_AND_FOLDERS_LIST_URL =
  "http://localhost:3050/generate-files-and-folders-list";

const LOCAL_SERVER_CACHED_IMAGES_URL = "http://localhost:3050/images/";

export default function Results({
  results,
  fileName,
  imageCache,
  serverIsLive,
  loading,
  onShowLoading,
}) {
  const [notesFolderData, setNotesFolderData] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    //Use a set based on the result notes, as there are more than one observation with the same note (folder)
    //This would reduce the number of requests send to the server
    const allNotes = results
      .map((result) => result?.note)
      .filter((note) => Boolean(note));
    const uniqueNotes = [...new Set(allNotes)];

    const urls = uniqueNotes.map(
      (note) => `${LOCAL_SERVER_GET_FILES_AND_FOLDERS_LIST_URL}?id=${note}`
    );

    const fetchData = async () => {
      try {
        // Create an array of fetch promises
        const responses = await Promise.all(
          urls.map(async (url, index) => {
            // Make sure to wait for the previous request to finish before firing the next one,
            // otherwise might get ERR_CONNECTION_REFUSED errors from the server
            return await fetch(url);
          })
        );

        // Check if all responses are OK
        const jsonPromises = responses.map((res) => {
          if (!res.status === "ok")
            throw new Error(`HTTP error! Status: ${res.status}`);
          return res.json();
        });

        const resultFilesAndFoldersList = await Promise.all(jsonPromises);
        setNotesFolderData(resultFilesAndFoldersList); // Store fetched notes/dolder data
      } catch (err) {
        setError(err.message);
      } finally {
        onShowLoading(false);
      }
    };

    if (serverIsLive) {
      fetchData();
    } else {
      onShowLoading(false);
    }

    // eslint-disable-next-line
  }, [results]);

  if (serverIsLive && error) {
    //If server is down we countinue without enhanced data such as folders processing or cached images
    //Continue on other errors
    return <p className="loading-data-error-wrapper">Error: {error}</p>;
  }

  if (loading) return;

  if (!results || results.length === 0) return null;

  return (
    <>
      {serverIsLive && (
        /* Only Allow PDF Reports when Local Server is available, because we need to beneft from the cached images */
        <PDFGenerateContainer fileName={fileName} />
      )}

      <div className="observation-display-containers-wrapper">
        {results.map((result, index) => {
          //Derive additional props

          //Sort all imgFrames and add together all datetime properties
          const observedOn = [...result?.imgFrames]
            .sort(
              ({ datetime: a }, { datetime: b }) => new Date(a) - new Date(b)
            )
            ?.reduce((acc, obs) => acc + (acc ? ", " : "") + obs.datetime, "");

          const imgFramesLength = result?.imgFrames?.length;

          const expTimeInSeconds = smartTime(result?.expTime || "0min");

          const listFilesFolders = notesFolderData.find(
            (d) => d?.path === result?.note
          )?.listFilesFolders;

          //Overwrite imagePath, even though it is part of {...result}
          let imagePath = `${PI_IMAGE_BASE_PATH}${result?.imagePath}`;

          //Use cached images where possible
          const imageInCache = imageCache.find(
            (i) => i.imageURL === imagePath
          )?.["imageLocal"];
          if (imageInCache) {
            imagePath = `${LOCAL_SERVER_CACHED_IMAGES_URL}${imageInCache}`;
          }

          //Spread the result properties onto each Result component
          return (
            <Result
              {...result}
              imagePath={imagePath}
              key={result.detailsID}
              currentIdx={index + 1}
              observedOn={observedOn}
              imgFramesLength={imgFramesLength}
              expTimeInSeconds={expTimeInSeconds}
              listFilesFolders={listFilesFolders}
            />
          );
        })}
      </div>
    </>
  );
}
