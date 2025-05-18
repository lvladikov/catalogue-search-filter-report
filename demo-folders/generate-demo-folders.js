const fs = require("fs");
const path = require("path");

const dataFilePath = "../data/demo-data.json";

//Helper function that would be used on every demo data entry
const createFoldersAndFiles = async (basePath, subfolders, files) => {
  try {
    // Create each subfolder inside the base path
    for (const folder of subfolders) {
      const folderPath = path.join(basePath, folder);
      await fs.promises.mkdir(folderPath, { recursive: true });

      // Create empty files inside each subfolder
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        await fs.promises.writeFile(filePath, ""); // Creates an empty file
      }
    }

    // console.log("Folders and files created successfully!");
  } catch (error) {
    console.error("Error creating folders/files:", error);
  }
};

(async () => {
  const data = await fs.promises.readFile(dataFilePath, "utf8");
  const jsonData = JSON.parse(data)?.observationsMeta;
  //Transform the JSON data to array of objects and extract only what we need
  const dataArray = Object.entries(jsonData).map(([key, value]) => ({
    key,
    note: value.note,
    imgFrames: value.imgFrames,
    tScope: value.tScope,
  }));

  for (let entry of dataArray) {
    const preparedFolder = entry.note;
    const preparedFrameFiles = entry.imgFrames.map((n) => n.fname);
    const preparedSubFolders = [entry.tScope.replace(/ /gi, "-")]; //for simplicity just one entry in the array, though in my real data this is actually an array with multiple sub folders

    //Create Subfolders and dummmy frame files
    createFoldersAndFiles(
      preparedFolder,
      preparedSubFolders,
      preparedFrameFiles
    );
  }
})();
