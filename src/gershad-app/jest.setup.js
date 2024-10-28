// Based on https://github.com/zeit/next.js/tree/canary/examples/with-jest

import "@testing-library/jest-dom/extend-expect";

const { configure } = require("@testing-library/react");

// ===============================
// === Increase timeouts in CI ===
// ===============================
//
// Raise Jest test and React Testing Library async utility timeouts in CI to
// avoid failures when runner servers are under load

if (process.env.CI) {
  jest.setTimeout(15000); // Default is 5000

  configure({
    asyncUtilTimeout: 10000, // Default is 1000
  });
}
