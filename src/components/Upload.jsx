import { useEffect } from "react";

const LOCAL_SERVER_CHECK_LIVE_URL = "http://localhost:3050/check-server-live";

const LOCAL_SERVER_UPDATE_IMAGE_CACHE_URL =
  "http://localhost:3050/cache-images";

export default function Upload({
  onUpdateData,
  onUpdateImageCache,
  onUpdateServerIsLive,
  file,
  setFile,
}) {
  useEffect(() => {
    if (file) {
      //Prepare the uploaded file contents as FormData
      const formData = new FormData();
      formData.append("file", file);

      const fetchData = async () => {
        try {
          //High level server quick availability check, which would be tracked in the app
          //and no unneccessary server calls would be made if down
          const timestamp = new Date().getTime();
          const checkServerLiveResponse = await fetch(
            `${LOCAL_SERVER_CHECK_LIVE_URL}?id=${timestamp}`
          );
          const checkServerLiveJSON = await checkServerLiveResponse.json();

          if (
            checkServerLiveJSON?.status === "ok" &&
            checkServerLiveJSON?.id === String(timestamp)
          ) {
            //Server is live
            onUpdateServerIsLive(true);
          } else {
            //Server is down
            onUpdateServerIsLive(false);
            onUpdateImageCache([]);

            return; //No need to continue
          }

          // Run the cache images server process once the file has been selected
          const imageCacheResponse = await fetch(
            LOCAL_SERVER_UPDATE_IMAGE_CACHE_URL,
            {
              method: "POST",
              body: formData,
            }
          );

          const imageCache = await imageCacheResponse.json();

          onUpdateImageCache(imageCache?.cache || []);
        } catch (err) {
          //If server is down or something else, gracefully continue with non-cached/original images
          console.log(`Image cache error`, err);
          onUpdateImageCache([]);
        }
      };

      fetchData();
    }

    return () => {};
    // eslint-disable-next-line
  }, [file]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (!file) return;

    setFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result); // Parse JSON data

        // Transform the JSON data to array of objects
        const resultArray = Object.entries(jsonData?.observationsMeta).map(
          ([key, value]) => ({ imagePath: key, ...value })
        );

        onUpdateData(resultArray); // Store the data in state
      } catch (error) {
        console.error("Invalid JSON file", error);
        onUpdateData([]);
      }
    };
    reader.readAsText(file); // Read file content as text
  };

  if (file) return; //Only show File Upload if no file state yet

  return (
    <div className="upload-json-wrapper">
      <h2>Please upload your Observations Data source.</h2>
      <input type="file" accept=".json" onChange={handleFileUpload} />
    </div>
  );
}
