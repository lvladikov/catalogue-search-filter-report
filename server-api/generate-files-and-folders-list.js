const { promises: fs } = require("fs");
const path = require("path");

async function getFolderAndFileListLines(currentPath, indentLevel) {
  const indent = " ".repeat(indentLevel); // Use given symbol for indentation
  const lines = []; // Array to hold the output lines for this level and below

  try {
    // Read directory contents, including file type information
    let entries = await fs.readdir(currentPath, { withFileTypes: true });

    // Sort entries alphabetically by name (case-insensitive sorting can be done with .toLowerCase())
    entries.sort((a, b) => a.name.localeCompare(b.name));

    // Process each entry
    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        // Add the directory line to the current level's lines
        lines.push(`${indent}${entry.name}`);

        // Recursively get lines for the subdirectory and append them
        const subDirLines = await getFolderAndFileListLines(
          entryPath,
          indentLevel + 1
        );
        lines.push(...subDirLines); // Use spread to add all lines from the subdirectory
      } else if (entry.isFile()) {
        // Add the file line to the current level's lines
        lines.push(`${indent}${entry.name}`);
      }
      // Ignore other types like symlinks (unless they resolve to file/dir, handled by isFile/isDirectory)
    }
  } catch (error) {
    // Handle errors for a specific directory (e.g., permission denied)
    // Add an error line to the output array instead of printing directly
    lines.push(`${indent}Error accessing ${currentPath}: ${error.message}`);
    // Optionally, you could choose to skip listing contents entirely on error for a path
    // return [];
  }

  return lines; // Return the collected lines for this path and its children
}

// Main function to orchestrate the listing and print the final result
async function listFilesAndFolders(startPath) {
  const allOutputLines = []; // Array to collect *all* output lines for the final console.log

  if (!startPath) {
    console.log("Usage: listFilesAndFolders <start_path>");
    // Print usage and exit immediately
    process.exit(1);
  }

  try {
    const stats = await fs.stat(startPath);

    if (!stats.isDirectory()) {
      // If the starting path is a file, just list that file name
      // console.log(`Listing file: ${startPath}`);
      allOutputLines.push(path.basename(startPath)); // Just the file name
    } else {
      // If it's a directory, add the initial header and get the recursive list
      // console.log(`Listing folders and files in: ${startPath}`);
      // Get the lines from the recursive function starting at the root level (0 indentation)
      const contentLines = await getFolderAndFileListLines(startPath, 0);
      // Add all lines returned by the recursive function to the main output array
      allOutputLines.push(...contentLines);
    }
  } catch (error) {
    // Handle critical errors (like the initial path not existing or being inaccessible)
    if (error.code === "ENOENT") {
      console.log(`Error: The provided path "${startPath}" does not exist.`);
    } else {
      console.log(
        `An unexpected error occurred when checking initial path "${startPath}": ${error.message}`
      );
    }
    process.exit(1);
  }

  // --- Final Output ---
  // Join all collected lines with newline characters
  return allOutputLines.join("\n");
}

module.exports = { listFilesAndFolders };
