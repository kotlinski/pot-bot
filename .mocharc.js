module.exports = {
  ui: "bdd",
  "check-leaks": true,
  recursive: true,
  slow: 200,
  reporter: "spec",
  require: ["babel-core/register", "@springworks/test-harness"],
};

