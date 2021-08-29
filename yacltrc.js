module.exports = {
  branchFormat: "[a-zA-Z]/([0-9]+)-.*",
  validationPattern: "\\[.*\\]\\s+.*\\s{#[\\d]+}",
  releaseNumber: require("./package.json").version.toString(),
};
