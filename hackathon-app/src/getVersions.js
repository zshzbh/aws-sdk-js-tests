import axios from "axios";
import semver from "semver";
export const getAwsSdkVersions = async () => {
  try {
    const response = await axios.get(
      // v3 is modularized and published as individual packages, by getting the versions of the S3 client, we get the version of the entire sdk v3.
      "https://registry.npmjs.org/@aws-sdk/client-s3"
    );
    const versions = Object.keys(response.data.versions);
    const sortedVersions = versions.sort((a, b) => semver.rcompare(a, b));

    return sortedVersions;
  } catch (error) {
    console.error("Error fetching AWS SDK versions:", error.message);
    return [];
  }
};

// Usage
getAwsSdkVersions().then((versions) => {
  console.log("AWS SDK versions:", versions);
});
