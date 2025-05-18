import { useState } from "react";
import Upload from "./components/Upload";
import Filter from "./components/filter/Filter";
import Results from "./components/results/Results";
import LoadingIndicator from "./components/LoadingIndicator";

import "./App.css";

export default function App() {
  const [serverIsLive, setServerIsLive] = useState(false);
  const [data, setData] = useState(null);
  const [imageCache, setImageCache] = useState(null);
  const [fileName, setFileName] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div>
      {!data && (
        <Upload
          onUpdateData={setData}
          onUpdateFileName={setFileName}
          onUpdateImageCache={setImageCache}
          onUpdateServerIsLive={setServerIsLive}
          fileName={fileName}
        />
      )}
      {data && (
        <Filter
          data={data}
          onUpdateFilters={setResults}
          serverIsLive={serverIsLive}
          loading={loading}
          onShowLoading={setLoading}
        />
      )}
      {loading && <LoadingIndicator />}
      {results && (
        <Results
          results={results}
          fileName={fileName}
          serverIsLive={serverIsLive}
          imageCache={imageCache}
          loading={loading}
          onShowLoading={setLoading}
        />
      )}
    </div>
  );
}
