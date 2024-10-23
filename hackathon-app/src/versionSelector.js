import React, { useState, useEffect } from "react";
import { getAwsSdkVersions } from "./getVersions";
export function useVersionSelector() {
  const [versions, setVersions] = useState(["3.65.0"]);
  const [selectedVersion, setSelectedVersion] = useState("3.65.0");

  useEffect(() => {
    async function loadVersions() {
      try {
        const fetchedVersions = await getAwsSdkVersions();
        setVersions(fetchedVersions);
      } catch (error) {
        console.error("Error fetching versions:", error);
      }
    }

    loadVersions();
  }, []);

  return { versions, selectedVersion, setSelectedVersion };
}

export function VersionSelector() {
  const { versions, selectedVersion, setSelectedVersion } =
    useVersionSelector();

  const handleVersionChange = (event) => {
    setSelectedVersion(event.target.value);
  };

  return (
    <select
      id="version-select"
      value={selectedVersion}
      onChange={handleVersionChange}
      size={10}
    >
      {versions.map((version) => (
        <option key={version} value={version}>
          {version}
        </option>
      ))}
    </select>
  );
}
