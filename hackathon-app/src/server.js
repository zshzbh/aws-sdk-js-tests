// server.js
const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const { exec } = require("child_process");
const util = require("util");

const execPromise = util.promisify(exec);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/write-file", async (req, res) => {
  try {
    const { content } = req.body;
    const filePath = path.join(__dirname, "repro.mjs");

    // Write the file
    await fs.writeFile(filePath, content);

    // Parse the file for required packages
    const packages = await parsePackages(filePath);

    // Install the packages
    if (packages.length > 0) {
      await installPackages(packages);
    }

    // Run the file
    const { stdout, stderr } = await execPromise("node repro.mjs");

    res.json({
      message: "File written, packages installed, and executed successfully",
      output: stdout,
      error: stderr,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

async function parsePackages(filePath) {
  const content = await fs.readFile(filePath, "utf-8");
  const requireRegex = /require\(['"](.*?)['"]\)/g;
  const importRegex = /import.*?from\s+['"](.*?)['"]/g;
  const packages = new Set();

  let match;
  while ((match = requireRegex.exec(content)) !== null) {
    if (!match[1].startsWith(".")) {
      packages.add(match[1].split("/")[0]);
    }
  }
  while ((match = importRegex.exec(content)) !== null) {
    if (!match[1].startsWith(".")) {
      packages.add(match[1].split("/")[0]);
    }
  }

  return Array.from(packages);
}

async function installPackages(packages) {
  const installCommand = `npm install ${packages.join(" ")}`;
  await execPromise(installCommand);
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
