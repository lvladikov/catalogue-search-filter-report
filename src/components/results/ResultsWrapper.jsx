import { memo } from "react";

import Result from "./Result";

import { smartTime } from "../../utils/date-and-time";

const PI_IMAGE_BASE_PATH = "https://i.postimg.cc/";
const LOCAL_SERVER_CACHED_IMAGES_URL = "http://localhost:3050/images/";

function ResultsWrapper({ results, notesFolderData, imageCache }) {
  return (
    <div className="observation-display-containers-wrapper">
      {results.map((result, index) => {
        //Derive additional props

        //Sort all imgFrames and add together all datetime properties
        const observedOn = [...result?.imgFrames]
          .sort(({ datetime: a }, { datetime: b }) => new Date(a) - new Date(b))
          ?.reduce((acc, obs) => acc + (acc ? ", " : "") + obs.datetime, "");

        const imgFramesLength = result?.imgFrames?.length;

        const expTimeInSeconds = smartTime(result?.expTime || "0min");

        const listFilesFolders = notesFolderData.find(
          (d) => d?.path === result?.note
        )?.listFilesFolders;

        //Overwrite imagePath, even though it is part of {...result}
        let imagePath = `${PI_IMAGE_BASE_PATH}${result?.imagePath}`;

        //Use cached images where possible
        const imageInCache = imageCache.find((i) => i.imageURL === imagePath)?.[
          "imageLocal"
        ];
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
  );
}

export default memo(ResultsWrapper);
