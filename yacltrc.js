const execSync = require("child_process").execSync;

const getCurrentBranch = () =>
  execSync("git branch --show-current").toString().replace(/\n/g, "").trim();

const allChangedFiles = () => {
  execSync(`git fetch origin master`, { stdio: "pipe" });
  const currentRevision = execSync("git rev-parse HEAD")
    .toString()
    .replace(/\n/g, "");
  return execSync(
    `git --no-pager diff --name-only origin/master ${currentRevision}`
  )
    .toString()
    .split("\n")
    .map((filename) => filename.trim())
    .filter(Boolean); // filter empty strings
};

module.exports = {
  branchFormat: "[a-zA-Z]/([0-9]+)-.*",
  releaseNumber: require("./package.json").version.toString(),
  preValidate: () => {
    const changedFiles = allChangedFiles();
    if (
      changedFiles.length > 0 &&
      !changedFiles.some((filename) => filename.startsWith("changelogs/")) &&
      getCurrentBranch() !== "master"
    ) {
      console.error(
        "No changelog has been added for the current change set. Create a new changelog entry for this change set."
      );
      return false;
    }
  },
  prePrepare: () => {
    // if work tree is not clean, can't prepare a release
    const changedFiles = execSync("git diff --stat --name-only")
      .toString()
      .trim();

    if (
      changedFiles.replace(/\n/g, "") !== "" &&
      changedFiles !== "package.json"
    ) {
      console.error(
        "Work tree is not clean. Releases can only be prepared from a clean work tree."
      );
      return false;
    }

    if (getCurrentBranch() !== "master") {
      console.error(
        `Releases can only be prepared from master! There should be no changes from master before preparing the changelog.`
      );
      return false;
    }
  },
};
