#!/usr/bin/env node
const fs = require("fs");
const path = process.argv[2];
let data = "#!/usr/bin/env node\n\n";
const fileData = fs.readFileSync(path).toString();
if (fileData.includes("#!/usr/bin/env node")) {
  return;
}
data += fileData;
fs.writeFileSync(path, data);
