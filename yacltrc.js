module.exports = {
  branchFormat: "[a-zA-Z]/([0-9]+)-.*",
  validationPattern: "\\[.*\\]\\s+.*\\s{#[\\d]+}",
  releaseNumber: require("./package.json").version.toString(),
  preNew: () => console.log("!!!!! PRE NEW"),
  postNew: () => console.log("!!! POST NEW"),
  preValidate: () => console.log("!!! PRE VALIDATE"),
  postValidate: () => console.log("!!! POST VALIDATE"),
  prePrepare: () => console.log("!!! PRE PREPARE"),
  postPrepare: () => console.log("!!! POST PREPARE"),
};
