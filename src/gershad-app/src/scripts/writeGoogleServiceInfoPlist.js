const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env.local") });

const contents = process.env.GOOGLE_SERVICE_INFO_FILE_CONTENTS;

if (!contents) {
  console.error(
    "The GOOGLE_SERVICE_INFO_FILE_CONTENTS environment variable is not set.",
  );
  process.exit(1);
}

try {
  fs.writeFileSync(
    path.join(__dirname, "../../ios/App/App/GoogleService-Info.plist"),
    contents,
  );

  // console.log("GoogleService-Info.plist has been successfully created!");
} catch (error) {
  console.error("Failed to parse JSON string:", error);
}
