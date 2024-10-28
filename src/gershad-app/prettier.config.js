/** @type {import("prettier").Config} */
const prettierConfig = {
  plugins: ["@prettier/plugin-xml"],
  trailingComma: "all",
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  overrides: [
    {
      files: ["*.json"],
      options: {
        // Prevent consolidating multiple values on one line
        printWidth: 1,
      },
    },
    {
      files: ["*.xml"],
      options: {
        // https://github.com/prettier/plugin-xml?tab=readme-ov-file#configuration
        xmlWhitespaceSensitivity: "preserve",
      },
    },
  ],
};

module.exports = prettierConfig;
