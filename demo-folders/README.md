# About this folder

## demo-folders

This folder is a simplified and simulated version of my observations folder where I keep all files and subfolders for every observation. The Client app and the Server app generate dynamically list of files and folders for each observation as part of the reporting.

So that these reports are not all empty in this public app and the generate folders and list part of the app still works, the folders and empty files here serve the purpose for those reports. I've included the top 5 pre-generated folders in the repo, but have also included a script that can generate a meaningful folder with subfolders and files for every observation in the demo-data.json folder.

To run this script and get a lot more folders than the checked in the repo ones, run `node generate-demo-folders.js` while in the current folder.
