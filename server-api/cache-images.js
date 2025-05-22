const fs = require("fs");
const path = require("path");

const axios = require("axios");

const CACHE_FILE = "image-cache.json";
const IMAGE_CACHE_FOLDER = path.resolve(__dirname, "../image-cache");
const PI_IMAGE_BASE_PATH = "https://i.postimg.cc/";
const MISSING_IMAGE_LOCAL = "missing_image.jpg";

exports.PI_IMAGE_BASE_PATH = PI_IMAGE_BASE_PATH;
exports.IMAGE_CACHE_FOLDER = IMAGE_CACHE_FOLDER;

// Ensure cache folder exists
if (!fs.existsSync(IMAGE_CACHE_FOLDER)) {
  fs.mkdirSync(IMAGE_CACHE_FOLDER);
}
// Load the existing cache or initialize an empty array
const loadCache = async () => {
  try {
    const data = await fs.promises.readFile(CACHE_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return []; // Return empty array if file doesn't exist or contains invalid JSON
  }
};
exports.loadCache = loadCache;

// Download an image if not cached
const downloadImage = async (imageURL) => {
  const filename = path.basename(imageURL);
  const localPath = path.join(IMAGE_CACHE_FOLDER, filename);

  if (fs.existsSync(localPath)) {
    // console.log(`✔ Image already exists: ${filename}`);
    return { imageURL, imageLocal: filename };
  }

  try {
    const response = await axios({ url: imageURL, responseType: "stream" });
    const writer = fs.createWriteStream(localPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log(`⬇ Downloaded: ${filename}`);
    return { imageURL, imageLocal: filename };
  } catch (error) {
    console.error(`❌ Failed to download ${imageURL}:`, error.message);
    return { imageURL, imageLocal: MISSING_IMAGE_LOCAL }; //Add to cache with the missing image URL
  }
};

// Save updated cache
const saveCache = async (cache) => {
  try {
    await fs.promises.writeFile(
      CACHE_FILE,
      JSON.stringify(cache, null, 2),
      "utf8"
    );
    console.log("✅ Cache saved successfully!");
  } catch (error) {
    console.error("❌ Error saving cache:", error);
  }
};

// Main function to process images
const processImages = async (imageUrls) => {
  let cache = await loadCache();
  const existingUrls = new Set(cache.map((entry) => entry.imageURL));

  const newEntries = await Promise.all(
    imageUrls.map(async (imageURL) => {
      if (!existingUrls.has(imageURL)) {
        return await downloadImage(imageURL);
      }
      // console.log(
      //   `✔ Already cached: ${imageURL
      //     .replace(PI_IMAGE_BASE_PATH, "")
      //     .split("/")
      //     .pop()}`
      // );
      return Promise.resolve(null); // Ensure a resolved Promise
    })
  );

  cache = [...cache, ...newEntries.filter(Boolean)];
  if (newEntries.filter(Boolean)?.length > 0) {
    await saveCache(cache);

    console.log(
      `✅ Image cache updated!\nTotal cache size: ${cache.length} images!`
    );
  } else {
    console.log(`✅ Total cache size: ${cache.length} images!`);
  }

  return {
    newImagesCount: newEntries.filter(Boolean).length,
    allImagesCount: cache.length,
    cache,
  };
};

const cacheImages = async (data) => {
  const jsonData = JSON.parse(data);

  //Get a list of all imageURLs from the passed in JSON data file
  const imagesFromData = Object.keys(jsonData?.observationsMeta).map(
    (v) => `${PI_IMAGE_BASE_PATH}${v}`
  );

  try {
    const { newImagesCount, allImagesCount, cache } = await processImages(
      imagesFromData
    );

    return {
      status: "ok",
      newImagesCount, //number of new cached images
      allImagesCount, //number of all cached images
      cache, //Complete cache so we can check in the Client if images are in the cache
    };
  } catch (err) {
    return {
      status: "error",
    };
  }
};

exports.cacheImages = cacheImages;
