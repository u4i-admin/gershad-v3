console.info(`Serving site from http://localhost:${process.env.PORT}`);

const isTest = (process.env.npm_lifecycle_event ?? "").startsWith("test");

module.exports = {
  compress: true,
  port: process.env.PORT,
  rewrite: [
    {
      from: "/(.*)",
      to: `/${isTest ? "out-test" : "out"}/$1`,
    },
  ],
  stack: ["lws-rewrite", "lws-compress", "lws-static"],
};
