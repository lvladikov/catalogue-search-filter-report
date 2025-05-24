import { useEffect, useState } from "react";

import ResultsWrapper from "./ResultsWrapper";

import PDFGenerateContainer from "../pdf-generate/PDFGenerateContainer";

const LOCAL_SERVER_GET_FILES_AND_FOLDERS_LIST_URL =
  "http://localhost:3050/generate-files-and-folders-list";

export default function Results({
  results,
  file,
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
        <PDFGenerateContainer file={file} />
      )}
      <ResultsWrapper
        results={results}
        notesFolderData={notesFolderData}
        imageCache={imageCache}
      />
    </>
  );
}
