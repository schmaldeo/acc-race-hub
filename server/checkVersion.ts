import { GithubVersionResponse } from "./types";

const checkVersion = async () => {
  const currentVersion = "v1.1.0";
  const newestVersion: GithubVersionResponse = await fetch("https://api.github.com/repos/schmatteo/acc-race-hub/releases/latest")
    .then((res) => res.json())
    .catch((err) => console.error(`There's been a problem checking for updates: ${err}`));
  newestVersion.tag_name === currentVersion && console.log("Everything is up to date");
  newestVersion.tag_name === currentVersion || console.log("Newer version available. Go to https://github.com/schmatteo/acc-race-hub/releases/latest to download it");
};

export default checkVersion;
