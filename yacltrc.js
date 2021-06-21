const execSync = require("child_process").execSync;

module.exports = {
  branchFormat: "[a-zA-Z]/([0-9]+)-.*",
  requireIssueIds: true,
  releaseNumber: () => require("./package.json").version.toString(),
};
