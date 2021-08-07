import fs from "fs";
const path = process.argv[2]!;
let data = "#!/usr/bin/env node\n\n";
const fileData = fs.readFileSync(path).toString();
if (fileData.includes("#!/usr/bin/env node")) {
  process.exit(0);
}
data += fileData;
fs.writeFileSync(path, data);
