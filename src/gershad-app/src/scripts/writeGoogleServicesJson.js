const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env.local") });

const contents = process.env.GOOGLE_SERVICES_JSON_FILE_CONTENTS;

if (!contents) {
  console.error(
    "The GOOGLE_SERVICES_JSON_FILE_CONTENTS environment variable is not set.",
  );
  process.exit(1);
}

try {
  const jsonObject = JSON.parse(contents);

  const formattedJson = JSON.stringify(jsonObject, null, 2);

  fs.writeFileSync(
    path.join(__dirname, "../../android/app/google-services.json"),
    formattedJson,
  );

  // console.log("google-services.json has been successfully created!");
} catch (error) {
  console.error("Failed to parse JSON string:", error);
}
