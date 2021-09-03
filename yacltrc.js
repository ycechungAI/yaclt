const execSync = require("child_process").execSync;

const getDefaultBranch = () =>
  execSync("git remote show origin | grep 'HEAD branch' | cut -d' ' -f5")
    .toString()
    .replace(/\n/g, "")
    .trim();

const allChangedFiles = () => {
  const defaultBranch = getDefaultBranch();
  execSync(`git fetch origin ${defaultBranch}`, { stdio: "pipe" });
  const currentRevision = execSync("git rev-parse HEAD")
    .toString()
    .replace(/\n/g, "");
  return execSync(
    `git --no-pager diff --name-only origin/${defaultBranch} ${currentRevision}`
  )
    .toString()
    .split("\n")
    .map((filename) => filename.trim())
    .filter(Boolean); // filter empty strings
};

module.exports = {
  branchFormat: "[a-zA-Z]/([0-9]+)-.*",
  validationPattern: "\\[.*\\]\\s+.*\\s{#[\\d]+}",
  releaseNumber: require("./package.json").version.toString(),
  preValidate: () => {
    const changedFiles = allChangedFiles();
    if (
      changedFiles.length > 0 &&
      !changedFiles.some((filename) => filename.startsWith("changelogs/"))
    ) {
      console.error(
        "No changelog has been added for the current change set. Create a new changelog entry for this change set."
      );
      return false;
    }
  },
};
