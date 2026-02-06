const madge = require("madge");
const path = require("path");

const SRC_PATH = path.join(__dirname, "src");

madge(SRC_PATH)
  .then((res) => {
    const circular = res.circular();
    console.log(circular);
    if (!circular.length) {
      console.log("No circular dependencies found!");
    } else {
      console.log("Circular dependencies detected:\n");
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("Error checking circular dependencies:", err);
    process.exit(1);
  });
