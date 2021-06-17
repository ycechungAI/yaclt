const execSync = require("child_process").execSync;

module.exports = {
  branchFormat: "[a-zA-Z]/([0-9]+)-.*",
  requireIssueIds: true,
  releaseNumber: () => {
    const revList = execSync("git rev-list --tags --max-count=1").toString();
    if (!revList) {
      return "release/1";
    }

    const lastTag = execSync(`git describe --tags ${revList}`);
    if (!lastTag) {
      return "release/1";
    }

    const lastReleaseNumber = lastTag.match(/([\d]+)/)?.[1];
    if (!lastReleaseNumber) {
      return "release/1";
    }

    const nextReleaseNumber = ~~lastReleaseNumber + 1;
    return `release/${nextReleaseNumber}`;
  },
};
